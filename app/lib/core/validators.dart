class Validators {
  static String? name(String? v) {
    final t = v?.trim() ?? '';
    if (t.isEmpty) return 'Please enter your name';
    if (t.length < 2) return 'Name must be at least 2 characters';
    if (t.length > 80) return 'Name must be under 80 characters';
    if (!RegExp(r"^[a-zA-Z .'-]+$").hasMatch(t)) {
      return 'Name can only contain letters and spaces';
    }
    return null;
  }

  static String? email(String? v) {
    final t = v?.trim() ?? '';
    if (t.isEmpty) return 'Please enter your email';
    if (!RegExp(r'^[\w.+-]+@[\w-]+(\.[\w-]+)+$').hasMatch(t)) {
      return 'Enter a valid email address';
    }
    return null;
  }

  static String? password(String? v) {
    if (v == null || v.isEmpty) return 'Please enter a password';
    if (v.length < 8) return 'Password must be at least 8 characters';
    if (!RegExp(r'[A-Za-z]').hasMatch(v)) return 'Add at least one letter';
    if (!RegExp(r'[0-9]').hasMatch(v)) return 'Add at least one number';
    return null;
  }

  static String? confirmPassword(String? v, String original) {
    if (v == null || v.isEmpty) return 'Please confirm your password';
    if (v != original) return 'Passwords do not match';
    return null;
  }

  static String? otp(String? v) {
    final t = v?.trim() ?? '';
    if (t.length != 6 || !RegExp(r'^[0-9]{6}$').hasMatch(t)) {
      return 'Enter the 6-digit code';
    }
    return null;
  }
}