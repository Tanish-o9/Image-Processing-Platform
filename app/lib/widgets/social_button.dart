import 'package:flutter/material.dart';

class SocialButton extends StatelessWidget {
  final String iconPath;
  final String label;
  final VoidCallback onPressed;

  const SocialButton({
    super.key,
    required this.iconPath,
    required this.label,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          side: const BorderSide(color: Color(0xFFE0E0E0)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(iconPath, width: 20, height: 20),
            const SizedBox(width: 8),
            Text(label, style: const TextStyle(color: Colors.black87)),
          ],
        ),
      ),
    );
  }
}