import 'package:flutter/material.dart';

class AppColors {
  // Gradient colors from the design
  static const Color gradientStart = Color(0xFF6255FC);
  static const Color gradientEnd = Color(0xFF38B8FD);

  // The gradient used on buttons (left to right, like the design)
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [gradientStart, gradientEnd],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
}