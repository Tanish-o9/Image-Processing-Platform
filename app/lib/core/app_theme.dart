import 'package:flutter/material.dart';
import 'package:app/core/app_colors.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: Colors.white,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.gradientStart,
    ),
  );
}