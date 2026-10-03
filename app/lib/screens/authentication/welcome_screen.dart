import 'package:flutter/material.dart';
import 'package:app/widgets/gradient_button.dart';
import 'package:app/screens/authentication/login_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              const SizedBox(height: 20),
              Image.asset('assets/images/logo.png', width: 150, height: 150),
              const SizedBox(height: 16),
              RichText(
                text: const TextSpan(
                  style: TextStyle(fontSize: 42, fontWeight: FontWeight.bold),
                  children: [
                    TextSpan(text: 'Image', style: TextStyle(color: Colors.black)),
                    TextSpan(text: 'Rise', style: TextStyle(color: Color(0xFF6255FC))),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Ai-Powered Image Processing & Analysis',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.black87,
                  fontWeight: FontWeight.w600,
                  fontSize: 20,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Transform your images with the power of AI. Edit, enhance, analyze and discover more.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontSize: 18, height: 1.4),
              ),
              const SizedBox(height: 16),
              // Takes whatever space is left, so nothing can overflow
              Expanded(
                child: Image.asset('assets/images/welcome_collage.png', width: 500, height: 500,),
              ),
              const SizedBox(height: 16),
              GradientButton(
                text: 'Get Started',
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const LoginScreen()),
                  );
                },
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}