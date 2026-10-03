import 'package:flutter/material.dart';
import 'package:app/widgets/gradient_button.dart';
import 'package:app/widgets/custom_text_field.dart';
import 'package:app/widgets/social_button.dart';
import 'package:app/core/validators.dart';
import 'package:app/services/auth_api.dart';
import 'package:app/screens/authentication/signup_screen.dart';
import 'package:app/screens/authentication/forgot_password_screen.dart';
import 'package:app/screens/authentication/otp_screen.dart';
import 'package:app/screens/home/home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _loading = false;
  bool _remember = true;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    final error = await AuthApi.login(_email.text, _password.text);
    if (!mounted) return;
    setState(() => _loading = false);

    if (error != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
      // If the account is not verified yet, send a new code and open the OTP screen
      if (error.toLowerCase().contains('verify your email')) {
        await AuthApi.resendVerification(_email.text);
        if (!mounted) return;
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => OtpScreen(email: _email.text.trim(), isReset: false),
          ),
        );
      }
      return;
    }

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => const HomeScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () => Navigator.pop(context),
                ),
                const SizedBox(height: 8),
                Center(
                  child: Image.asset('assets/images/logo.png', width: 70, height: 70),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Welcome Back',
                  style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Sign in to continue your ImageRise journey',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 24),
                CustomTextField(
                  hintText: 'Email address',
                  icon: Icons.email_outlined,
                  controller: _email,
                  keyboardType: TextInputType.emailAddress,
                  validator: Validators.email,
                ),
                const SizedBox(height: 14),
                CustomTextField(
                  hintText: 'Password',
                  icon: Icons.lock_outline,
                  obscureText: true,
                  controller: _password,
                  validator: (v) =>
                      (v == null || v.isEmpty) ? 'Please enter your password' : null,
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Checkbox(
                          value: _remember,
                          onChanged: (v) => setState(() => _remember = v ?? false),
                        ),
                        const Text('Remember Password'),
                      ],
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ForgotPasswordScreen(),
                          ),
                        );
                      },
                      child: const Text('Forgot password?'),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                GradientButton(
                  text: _loading ? 'Please wait...' : 'Login',
                  onPressed: _loading ? () {} : _login,
                ),
                const SizedBox(height: 20),
                const Center(
                  child: Text('or continue with', style: TextStyle(color: Colors.grey)),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    SocialButton(iconPath: 'assets/images/google.png', label: 'Google', onPressed: () {}),
                    const SizedBox(width: 12),
                    SocialButton(iconPath: 'assets/images/apple.png', label: 'Apple', onPressed: () {}),
                  ],
                ),
                const SizedBox(height: 24),
                Center(
                  child: TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SignupScreen()),
                      );
                    },
                    child: RichText(
                      text: const TextSpan(
                        style: TextStyle(color: Colors.black87),
                        children: [
                          TextSpan(text: "Don't have an account? "),
                          TextSpan(
                            text: 'Sign Up',
                            style: TextStyle(
                              color: Color(0xFF6255FC),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}