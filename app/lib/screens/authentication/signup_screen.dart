import 'package:flutter/material.dart';
import 'package:app/widgets/gradient_button.dart';
import 'package:app/widgets/custom_text_field.dart';
import 'package:app/widgets/social_button.dart';

class SignupScreen extends StatelessWidget {
  const SignupScreen({super.key});

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
              const Text('Create Your account',
                  style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              const Text(
                'Join ImageForge and start creating editing and analyzing images with AI.',
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 24),
              const CustomTextField(hintText: 'Full Name', icon: Icons.person_outline),
              const SizedBox(height: 14),
              const CustomTextField(hintText: 'Email address', icon: Icons.email_outlined),
              const SizedBox(height: 14),
              const CustomTextField(
                hintText: 'Password',
                icon: Icons.lock_outline,
                obscureText: true,
              ),
              const SizedBox(height: 14),
              const CustomTextField(
                hintText: 'Confirm Password',
                icon: Icons.lock_outline,
                obscureText: true,
              ),
              const SizedBox(height: 20),
              GradientButton(text: 'Sign Up', onPressed: () {}),
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
    );
  }
}