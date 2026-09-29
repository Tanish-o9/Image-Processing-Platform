import 'package:flutter/material.dart';
import 'package:app/core/app_theme.dart';
import 'package:app/screens/authentication/welcome_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'ImageForge',
      theme: AppTheme.lightTheme,
      home: const WelcomeScreen(),
    );
  }
}