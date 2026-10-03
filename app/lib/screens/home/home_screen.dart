import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:app/core/app_colors.dart';
import 'package:app/widgets/custom_bottom_nav.dart';
import 'package:app/screens/home/notification_screen.dart';
import 'package:app/screens/home/search_screen.dart';
import 'package:app/screens/upload/upload_screen.dart';
import 'package:app/screens/processing/edit_image_screen.dart';
import 'package:app/screens/processing/workspace_screen.dart';
import 'package:app/screens/analysis/ai_analysis_screen.dart';
import 'package:app/services/image_store.dart';
import 'package:app/services/auth_api.dart';
import 'package:app/services/sample_presets.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  String _greeting() {
    final h = DateTime.now().hour;
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  String _firstName() {
    final n = AuthApi.userName.trim();
    if (n.isEmpty) return 'there';
    return n.split(' ').first;
  }

  // If no photo is chosen yet, open the gallery first, then go to the screen.
  Future<void> _openWithImage(BuildContext context, Widget screen) async {
    if (ImageStore.bytes == null) {
      try {
        final picked =
            await ImagePicker().pickImage(source: ImageSource.gallery);
        if (picked == null) {
          // If user cancelled or gallery is empty, offer preset
          if (!context.mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('No photo picked. Opening Upload Screen...'),
              action: SnackBarAction(
                label: 'Presets',
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const UploadScreen(),
                    ),
                  );
                },
              ),
            ),
          );
          return;
        }
        final bytes = await picked.readAsBytes();
        ImageStore.setImage(bytes, picked.name);
      } catch (e) {
        if (!context.mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Could not open gallery: $e'),
            action: SnackBarAction(
              label: 'Use Sample',
              onPressed: () async {
                final presetBytes =
                    await SamplePresets.presets.first.loadBytes();
                ImageStore.setImage(presetBytes, 'sample_landscape.jpg');
                if (!context.mounted) return;
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => screen),
                );
              },
            ),
          ),
        );
        return;
      }
    }
    if (!context.mounted) return;
    Navigator.push(context, MaterialPageRoute(builder: (context) => screen));
  }

  @override
  Widget build(BuildContext context) {
    final recent = ImageStore.recentImages;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _greeting(),
                        style: const TextStyle(color: Colors.grey),
                      ),
                      Text(
                        _firstName(),
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.notifications_none, size: 26),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const NotificationScreen(),
                        ),
                      );
                    },
                  ),
                ],
              ),
              const Text(
                'Explore the power of AI in your images',
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 16),
              InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const SearchScreen(),
                    ),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 12,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F7),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: const [
                      Icon(Icons.search, color: Colors.grey),
                      SizedBox(width: 8),
                      Text(
                        'Search features, tools...',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () => _openWithImage(context, const AiAnalysisScreen()),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(
                          Icons.auto_awesome,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        'AI Image Analysis',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Check brightness, sharpness, noise & more with AI',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'Try Now',
                          style: TextStyle(
                            color: Color(0xFF6255FC),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const UploadScreen(),
                        ),
                      ),
                      child: _actionCard(
                        Icons.upload_outlined,
                        'Upload Image',
                        'Start Processing',
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: InkWell(
                      onTap: () =>
                          _openWithImage(context, const EditImageScreen()),
                      child: _actionCard(
                        Icons.edit_outlined,
                        'Edit Image',
                        'Enhance & modify',
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () =>
                          _openWithImage(context, const AiAnalysisScreen()),
                      child: _actionCard(
                        Icons.psychology_outlined,
                        'AI Analysis',
                        'Get image insights',
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const UploadScreen(),
                          ),
                        );
                      },
                      child: _actionCard(
                        Icons.auto_awesome_motion_outlined,
                        'Sample Presets',
                        'Instant test photos',
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Recent Images',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  InkWell(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const UploadScreen(),
                      ),
                    ),
                    child: const Text(
                      'See all',
                      style: TextStyle(color: Color(0xFF6255FC), fontSize: 12),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Expanded(
                child: recent.isNotEmpty
                    ? ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: recent.length,
                        separatorBuilder: (context, index) =>
                            const SizedBox(width: 10),
                        itemBuilder: (context, index) {
                          final item = recent[index];
                          return InkWell(
                            borderRadius: BorderRadius.circular(12),
                            onTap: () {
                              ImageStore.setImage(item.bytes, item.name);
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      const WorkspaceScreen(),
                                ),
                              );
                            },
                            child: Container(
                              width: 80,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: const Color(0xFFE0E0E0),
                                ),
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: Image.memory(
                                  item.bytes,
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                          );
                        },
                      )
                    : ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: SamplePresets.presets.length,
                        separatorBuilder: (context, index) =>
                            const SizedBox(width: 10),
                        itemBuilder: (context, index) {
                          final preset = SamplePresets.presets[index];
                          return InkWell(
                            borderRadius: BorderRadius.circular(12),
                            onTap: () async {
                              final b = await preset.loadBytes();
                              ImageStore.setImage(
                                b,
                                '${preset.title.toLowerCase().replaceAll(' ', '_')}.jpg',
                              );
                              if (!context.mounted) return;
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      const WorkspaceScreen(),
                                ),
                              );
                            },
                            child: Container(
                              width: 80,
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF5F5F7),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: const Color(0xFFE0E0E0),
                                ),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.image,
                                    color: Color(0xFF6255FC),
                                    size: 24,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    preset.title.split(' ').first,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const CustomBottomNav(currentIndex: 0),
    );
  }

  Widget _actionCard(IconData icon, String title, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFFE0E0E0)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: const Color(0xFF6255FC)),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
          ),
          Text(
            subtitle,
            style: const TextStyle(color: Colors.grey, fontSize: 11),
          ),
        ],
      ),
    );
  }
}