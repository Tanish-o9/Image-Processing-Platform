import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:app/core/app_colors.dart';
import 'package:app/screens/home/home_screen.dart';
import 'package:app/screens/home/search_screen.dart';
import 'package:app/screens/home/profile_screen.dart';
import 'package:app/screens/history/save_export_screen.dart';
import 'package:app/screens/processing/workspace_screen.dart';
import 'package:app/services/image_store.dart';

class CustomBottomNav extends StatelessWidget {
  final int currentIndex;

  const CustomBottomNav({super.key, required this.currentIndex});

  void _onTap(BuildContext context, int index) {
    if (index == currentIndex) return;

    if (index == 0) {
      // Home: clear everything and show a fresh Home
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const HomeScreen()),
        (route) => false,
      );
      return;
    }

    Widget nextScreen;
    switch (index) {
      case 1:
        nextScreen = const SaveExportScreen();
        break;
      case 3:
        nextScreen = const SearchScreen();
        break;
      case 4:
        nextScreen = const ProfileScreen();
        break;
      default:
        return;
    }

    // Open the tab on top of Home, so the back button returns to Home
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => nextScreen),
      (route) => route.isFirst,
    );
  }

  // The + button: pick a photo from the gallery, then open the Workspace
  Future<void> _pickAndOpen(BuildContext context) async {
    try {
      final picked = await ImagePicker().pickImage(source: ImageSource.gallery);
      if (picked == null) return;
      final bytes = await picked.readAsBytes();
      ImageStore.setImage(bytes, picked.name);
      if (!context.mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const WorkspaceScreen()),
      );
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Could not open gallery: $e')));
    }
  }

  Widget _navItem(BuildContext context, IconData icon, String label, int index) {
    final bool isActive = index == currentIndex;
    return InkWell(
      onTap: () => _onTap(context, index),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: isActive ? AppColors.gradientStart : Colors.grey, size: 22),
          const SizedBox(height: 2),
          Text(label, style: TextStyle(fontSize: 11, color: isActive ? AppColors.gradientStart : Colors.grey)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFEFEFEF))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _navItem(context, Icons.home, 'Home', 0),
          _navItem(context, Icons.history, 'History', 1),
          Container(
            width: 44,
            height: 44,
            decoration: const BoxDecoration(gradient: AppColors.primaryGradient, shape: BoxShape.circle),
            child: IconButton(
              icon: const Icon(Icons.add, color: Colors.white),
              onPressed: () => _pickAndOpen(context),
            ),
          ),
          _navItem(context, Icons.explore, 'Explore', 3),
          _navItem(context, Icons.person, 'Profile', 4),
        ],
      ),
    );
  }
}