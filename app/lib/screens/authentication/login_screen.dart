import 'package:flutter/material.dart';
import 'package:app/widgets/gradient_button.dart';
import 'package:app/widgets/custom_text_field.dart';
import 'package:app/widgets/social_button.dart';
import 'package:app/screens/authentication/signup_screen.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
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
              const Text('Welcome Back',
                  style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              const Text(
                'Sign in to continue your ImageForge journey',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 24),
              const CustomTextField(hintText: 'Email address', icon: Icons.email_outlined),
              const SizedBox(height: 14),
              const CustomTextField(
                hintText: 'Password',
                icon: Icons.lock_outline,
                obscureText: true,
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Checkbox(value: true, onChanged: (v) {}),
                      const Text('Remember Password'),
                    ],
                  ),
                  TextButton(
                    onPressed: () {},
                    child: const Text('Forgot password?'),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              GradientButton(text: 'Login', onPressed: () {}),
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
              const Spacer(),
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
                        TextSpan(text: 'Sign Up', style: TextStyle(color: Color(0xFF6255FC), fontWeight: FontWeight.bold)),
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
    );
  }
}