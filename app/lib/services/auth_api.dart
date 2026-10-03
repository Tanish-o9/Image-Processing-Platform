import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthApi {
  // Deployed backend (used only when useLocal = false)
  static const String baseUrl =
      'https://image-processing-platform-iylj.onrender.com';

  // true  = DEMO mode: works inside the app, no server, OTP is always 123456
  // false = REAL mode: uses the backend and real email OTP
  static bool useLocal = true;

  static const String demoOtp = '123456';

  static String? token;
  static Map<String, dynamic>? user;

  static bool get isLoggedIn => token != null;
  static String get userName => '${user?['name'] ?? ''}';
  static String get userEmail => '${user?['email'] ?? ''}';

  // ---------- Demo mode storage (saved on the phone) ----------
  static final Map<String, Map<String, dynamic>> _users = {
    'demo@test.com': {
      'name': 'Demo User',
      'password': 'Demo@1234',
      'verified': true,
    },
  };

  static bool _loaded = false;

  /// Loads saved accounts and the saved login. Safe to call many times.
  static Future<void> init() async {
    if (_loaded) return;
    try {
      final p = await SharedPreferences.getInstance();
      final raw = p.getString('local_users');
      if (raw != null) {
        final decoded = jsonDecode(raw) as Map<String, dynamic>;
        decoded.forEach((k, v) {
          _users[k] = Map<String, dynamic>.from(v as Map);
        });
      }
      token = p.getString('auth_token');
      final u = p.getString('auth_user');
      if (u != null) user = Map<String, dynamic>.from(jsonDecode(u));
    } catch (_) {}
    _loaded = true;
  }

  static Future<void> _saveUsers() async {
    try {
      final p = await SharedPreferences.getInstance();
      await p.setString('local_users', jsonEncode(_users));
    } catch (_) {}
  }

  static Future<void> _saveSession() async {
    try {
      final p = await SharedPreferences.getInstance();
      if (token == null) {
        await p.remove('auth_token');
        await p.remove('auth_user');
      } else {
        await p.setString('auth_token', token!);
        await p.setString('auth_user', jsonEncode(user ?? {}));
      }
    } catch (_) {}
  }

  static String _key(String email) => email.trim().toLowerCase();

  // ---------- Public functions: each returns an error message, or null if OK ----------

  static Future<String?> register(
      String name, String email, String password) async {
    await init();
    if (useLocal) {
      final k = _key(email);
      final existing = _users[k];
      if (existing != null && existing['verified'] == true) {
        return 'An account with this email already exists';
      }
      _users[k] = {'name': name.trim(), 'password': password, 'verified': false};
      await _saveUsers();
      return null;
    }
    return _post('/register', {
      'name': name.trim(),
      'email': email.trim(),
      'password': password,
    });
  }

  static Future<String?> verifyEmail(String email, String otp) async {
    await init();
    if (useLocal) {
      final u = _users[_key(email)];
      if (u == null) return 'User not found';
      if (otp.trim() != demoOtp) return 'Invalid OTP. Please try again.';
      u['verified'] = true;
      await _saveUsers();
      return null;
    }
    return _post('/verify-email', {'email': email.trim(), 'otp': otp.trim()});
  }

  static Future<String?> resendVerification(String email) async {
    await init();
    if (useLocal) return null;
    return _post('/resend-verification', {'email': email.trim()});
  }

  static Future<String?> login(String email, String password) async {
    await init();
    if (useLocal) {
      final k = _key(email);
      final u = _users[k];
      if (u == null || u['password'] != password) {
        return 'Invalid email or password';
      }
      if (u['verified'] != true) {
        return 'Please verify your email before logging in';
      }
      token = 'local-token';
      user = {'name': u['name'], 'email': k};
      await _saveSession();
      return null;
    }
    final err = await _post(
      '/login',
      {'email': email.trim(), 'password': password},
      onSuccess: (data) {
        final d = data['data'] is Map ? data['data'] : data;
        token = d['token'] as String?;
        if (d['user'] is Map) user = Map<String, dynamic>.from(d['user']);
      },
    );
    if (err == null) await _saveSession();
    return err;
  }

  /// Step 1 of password reset: sends the OTP to the email.
  static Future<String?> forgotPassword(String email) async {
    await init();
    if (useLocal) return null;
    return _post('/forgot-password', {'email': email.trim()});
  }

  /// Step 2 of password reset: checks the OTP the user typed.
  static Future<String?> verifyResetOtp(String email, String otp) async {
    await init();
    if (useLocal) {
      final u = _users[_key(email)];
      if (u == null || otp.trim() != demoOtp) {
        return 'Invalid OTP. Please try again.';
      }
      return null;
    }
    final err = await _post('/verify-reset-otp', {
      'email': email.trim(),
      'otp': otp.trim(),
    });
    // If the deployed backend does not have this route yet, continue;
    // /reset-password will still check the OTP.
    if (err != null && err.contains('Route not found')) {
      return null;
    }
    return err;
  }

  /// Step 3 of password reset: sets the new password.
  static Future<String?> resetPassword(
      String email, String otp, String newPassword) async {
    await init();
    if (useLocal) {
      final u = _users[_key(email)];
      if (u == null || otp.trim() != demoOtp) {
        return 'Invalid OTP. Please try again.';
      }
      u['password'] = newPassword;
      await _saveUsers();
      return null;
    }
    return _post('/reset-password', {
      'email': email.trim(),
      'otp': otp.trim(),
      'newPassword': newPassword,
    });
  }

  static Future<void> logout() async {
    token = null;
    user = null;
    await _saveSession();
  }

  // ---------- Real server call (used only when useLocal = false) ----------
  static Future<String?> _post(
    String path,
    Map<String, dynamic> body, {
    void Function(Map<String, dynamic> data)? onSuccess,
  }) async {
    try {
      final root = baseUrl.replaceAll(RegExp(r'/+$'), '');
      final res = await http
          .post(
            Uri.parse('$root/api/auth$path'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 70));

      Map<String, dynamic> data = {};
      try {
        final d = jsonDecode(res.body);
        if (d is Map<String, dynamic>) data = d;
      } catch (_) {}

      if (res.statusCode >= 200 && res.statusCode < 300) {
        onSuccess?.call(data);
        return null;
      }
      return _errorMessage(data, res.statusCode);
    } on TimeoutException {
      return 'The server is taking too long to respond. Please try again.';
    } catch (e) {
      return 'Could not connect to the server. Check your internet and try again.';
    }
  }

  static String _errorMessage(Map<String, dynamic> data, int code) {
    String? raw;
    final errors = data['errors'];
    if (errors is List && errors.isNotEmpty) {
      final first = errors.first;
      if (first is Map) {
        final m = first['message'] ?? first['msg'];
        if (m is String) raw = m;
      } else if (first is String) {
        raw = first;
      }
    }
    raw ??= data['message'] as String?;

    if (raw != null && raw.isNotEmpty) {
      final lower = raw.toLowerCase();
      if (lower.contains('expired')) {
        return 'OTP expired. Please request a new OTP.';
      }
      if (lower.contains('invalid') && lower.contains('otp')) {
        return 'Invalid OTP. Please try again.';
      }
      return raw;
    }
    if (code == 400) return 'Invalid OTP. Please try again.';
    if (code == 404) return 'User not found';
    if (code == 429) {
      return 'Too many attempts. Please wait a moment and try again.';
    }
    return 'Something went wrong (code $code)';
  }
}