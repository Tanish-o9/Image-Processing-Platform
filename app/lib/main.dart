import 'package:flutter/material.dart';
import 'package:app/core/app_theme.dart';
import 'package:app/screens/authentication/welcome_screen.dart';
import 'package:app/screens/home/home_screen.dart';
import 'package:app/services/auth_api.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AuthApi.init(); // loads saved accounts and the saved login
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'ImageRise',
      theme: AppTheme.lightTheme,
      home: AuthApi.isLoggedIn ? const HomeScreen() : const WelcomeScreen(),
    );
  }
}