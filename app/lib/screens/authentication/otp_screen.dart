import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:app/widgets/gradient_button.dart';
import 'package:app/widgets/custom_text_field.dart';
import 'package:app/core/validators.dart';
import 'package:app/services/auth_api.dart';
import 'package:app/screens/authentication/password_updated_screen.dart';
import 'package:app/screens/authentication/login_screen.dart';

enum _Stage { enterOtp, newPassword }

class OtpScreen extends StatefulWidget {
  final String email;
  final bool isReset;

  const OtpScreen({super.key, required this.email, this.isReset = false});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  static const int _resendSeconds = 30;

  final _passwordKey = GlobalKey<FormState>();
  final List<TextEditingController> controllers = List.generate(
    6,
    (index) => TextEditingController(),
  );
  final List<FocusNode> focusNodes = List.generate(6, (index) => FocusNode());
  final _newPassword = TextEditingController();
  final _confirmPassword = TextEditingController();

  _Stage _stage = _Stage.enterOtp;
  String _verifiedOtp = '';
  String? _error;
  bool _loading = false;
  int _seconds = _resendSeconds;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _runTimer();
  }

  void _runTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return;
      if (_seconds <= 1) {
        t.cancel();
        setState(() => _seconds = 0);
      } else {
        setState(() => _seconds--);
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (final c in controllers) {
      c.dispose();
    }
    for (final f in focusNodes) {
      f.dispose();
    }
    _newPassword.dispose();
    _confirmPassword.dispose();
    super.dispose();
  }

  void _snack(String text) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));
  }

  String get _otp => controllers.map((c) => c.text).join();

  void _clearBoxes() {
    for (final c in controllers) {
      c.clear();
    }
    focusNodes.first.requestFocus();
  }

  // Step: check the 6 digits the user typed
  Future<void> _verifyOtp() async {
    final otp = _otp;
    final formatError = Validators.otp(otp);
    if (formatError != null) {
      setState(() => _error = formatError);
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
    });
    final error = widget.isReset
        ? await AuthApi.verifyResetOtp(widget.email, otp)
        : await AuthApi.verifyEmail(widget.email, otp);
    if (!mounted) return;
    setState(() => _loading = false);

    if (error != null) {
      setState(() => _error = error);
      _clearBoxes();
      return;
    }

    if (widget.isReset) {
      // OTP is correct: now ask for the new password
      setState(() {
        _verifiedOtp = otp;
        _stage = _Stage.newPassword;
      });
    } else {
      _snack('Email verified! Please log in.');
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  // Step: save the new password
  Future<void> _savePassword() async {
    if (!_passwordKey.currentState!.validate()) return;

    setState(() => _loading = true);
    final error = await AuthApi.resetPassword(
      widget.email,
      _verifiedOtp,
      _newPassword.text,
    );
    if (!mounted) return;
    setState(() => _loading = false);

    if (error != null) {
      // If the OTP expired in the meantime, go back and ask for a new one
      if (error.toLowerCase().contains('otp')) {
        setState(() {
          _stage = _Stage.enterOtp;
          _error = error;
        });
        _clearBoxes();
      } else {
        _snack(error);
      }
      return;
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const PasswordUpdatedScreen()),
    );
  }

  Future<void> _resend() async {
    setState(() => _error = null);
    final error = widget.isReset
        ? await AuthApi.forgotPassword(widget.email)
        : await AuthApi.resendVerification(widget.email);
    if (!mounted) return;
    if (error != null) {
      _snack(error);
      return;
    }
    _snack('A new OTP has been sent to your email');
    _clearBoxes();
    setState(() => _seconds = _resendSeconds);
    _runTimer();
  }

  @override
  Widget build(BuildContext context) {
    final inPasswordStage = _stage == _Stage.newPassword;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => Navigator.pop(context),
              ),
              const SizedBox(height: 8),
              Center(child: Image.asset('assets/images/otp.png', height: 180)),
              const SizedBox(height: 20),
              Text(
                inPasswordStage
                    ? 'Create New Password'
                    : (widget.isReset ? 'Reset Password' : 'Verify Your Email'),
                style: const TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                inPasswordStage
                    ? 'Your code is verified. Choose a new password.'
                    : 'Enter the 6-digit code sent to ${widget.email}.',
                style: const TextStyle(color: Colors.grey),
              ),
              if (AuthApi.useLocal && !inPasswordStage) ...[
                const SizedBox(height: 6),
                const Text(
                  'Demo mode: use the code 123456',
                  style: TextStyle(color: Color(0xFF6255FC), fontSize: 12),
                ),
              ],
              const SizedBox(height: 24),
              if (!inPasswordStage) ..._otpStage() else ..._passwordStage(),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> _otpStage() {
    return [
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: List.generate(6, (index) {
          return SizedBox(
            width: 45,
            child: TextField(
              controller: controllers[index],
              focusNode: focusNodes[index],
              textAlign: TextAlign.center,
              keyboardType: TextInputType.number,
              maxLength: 1,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              onChanged: (value) {
                if (_error != null) setState(() => _error = null);
                if (value.isNotEmpty && index < 5) {
                  focusNodes[index + 1].requestFocus();
                } else if (value.isEmpty && index > 0) {
                  focusNodes[index - 1].requestFocus();
                }
              },
              decoration: InputDecoration(
                counterText: '',
                filled: true,
                fillColor: const Color(0xFFF5F5F7),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          );
        }),
      ),
      if (_error != null) ...[
        const SizedBox(height: 12),
        Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 13)),
      ],
      const SizedBox(height: 16),
      if (_seconds > 0)
        Center(
          child: Text(
            'Resend OTP in 00:${_seconds.toString().padLeft(2, '0')}',
            style: const TextStyle(color: Colors.grey),
          ),
        ),
      const SizedBox(height: 4),
      Center(
        child: TextButton(
          onPressed: _seconds == 0 ? _resend : null,
          child: const Text('Resend OTP'),
        ),
      ),
      const SizedBox(height: 12),
      GradientButton(
        text: _loading ? 'Please wait...' : 'Verify OTP',
        onPressed: _loading ? () {} : _verifyOtp,
      ),
      const SizedBox(height: 12),
      SizedBox(
        width: double.infinity,
        child: OutlinedButton(
          onPressed: () => Navigator.pop(context),
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            side: const BorderSide(color: Color(0xFFE0E0E0)),
          ),
          child: const Text(
            'Change Email',
            style: TextStyle(color: Colors.black87),
          ),
        ),
      ),
    ];
  }

  List<Widget> _passwordStage() {
    return [
      Form(
        key: _passwordKey,
        child: Column(
          children: [
            CustomTextField(
              hintText: 'New password',
              icon: Icons.lock_outline,
              obscureText: true,
              controller: _newPassword,
              validator: Validators.password,
            ),
            const SizedBox(height: 14),
            CustomTextField(
              hintText: 'Confirm new password',
              icon: Icons.lock_outline,
              obscureText: true,
              controller: _confirmPassword,
              validator: (v) =>
                  Validators.confirmPassword(v, _newPassword.text),
            ),
          ],
        ),
      ),
      const SizedBox(height: 24),
      GradientButton(
        text: _loading ? 'Please wait...' : 'Reset Password',
        onPressed: _loading ? () {} : _savePassword,
      ),
    ];
  }
}