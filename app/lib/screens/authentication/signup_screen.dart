import 'package:flutter/material.dart';
import 'package:app/widgets/gradient_button.dart';
import 'package:app/widgets/custom_text_field.dart';
import 'package:app/widgets/social_button.dart';
import 'package:app/core/validators.dart';
import 'package:app/services/auth_api.dart';
import 'package:app/screens/authentication/otp_screen.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirm = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _confirm.dispose();
    super.dispose();
  }

  Future<void> _signup() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    final error = await AuthApi.register(_name.text, _email.text, _password.text);
    if (!mounted) return;
    setState(() => _loading = false);

    if (error != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
      return;
    }
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => OtpScreen(email: _email.text.trim(), isReset: false),
      ),
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
                const Text('Create Your account',
                    style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                const Text(
                  'Join ImageRise and start creating editing and analyzing images with AI.',
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 24),
                CustomTextField(
                  hintText: 'Full Name',
                  icon: Icons.person_outline,
                  controller: _name,
                  validator: Validators.name,
                ),
                const SizedBox(height: 14),
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
                  validator: Validators.password,
                ),
                const SizedBox(height: 14),
                CustomTextField(
                  hintText: 'Confirm Password',
                  icon: Icons.lock_outline,
                  obscureText: true,
                  controller: _confirm,
                  validator: (v) => Validators.confirmPassword(v, _password.text),
                ),
                const SizedBox(height: 20),
                GradientButton(
                  text: _loading ? 'Please wait...' : 'Sign Up',
                  onPressed: _loading ? () {} : _signup,
                ),
                const SizedBox(height: 20),
                const Center(child: Text('or continue with', style: TextStyle(color: Colors.grey))),
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
                    onPressed: () => Navigator.pop(context),
                    child: RichText(
                      text: const TextSpan(
                        style: TextStyle(color: Colors.black87),
                        children: [
                          TextSpan(text: 'Already have an account? '),
                          TextSpan(text: 'Login', style: TextStyle(color: Color(0xFF6255FC), fontWeight: FontWeight.bold)),
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