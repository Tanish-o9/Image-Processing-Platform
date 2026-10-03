import 'package:flutter/material.dart';
import 'package:app/widgets/custom_bottom_nav.dart';
import 'package:app/screens/processing/edit_image_screen.dart';
import 'package:app/screens/analysis/ai_analysis_screen.dart';
import 'package:app/services/image_store.dart';

class WorkspaceScreen extends StatelessWidget {
  const WorkspaceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final bytes = ImageStore.bytes;
    final sizeMb = bytes == null
        ? '0.0'
        : (bytes.length / (1024 * 1024)).toStringAsFixed(1);
    final ext = ImageStore.name.contains('.')
        ? ImageStore.name.split('.').last.toUpperCase()
        : 'IMG';

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              Row(
                children: [
                  IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => Navigator.pop(context)),
                  const Text('Image Workspace', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: bytes != null
                    ? Image.memory(bytes, height: 180, width: double.infinity, fit: BoxFit.cover)
                    : Image.asset('assets/images/welcome_collage.png', height: 180, width: double.infinity, fit: BoxFit.cover),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: const Color(0xFFF5F5F7), borderRadius: BorderRadius.circular(10)),
                child: Row(
                  children: [
                    const Icon(Icons.image_outlined, color: Color(0xFF6255FC)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(ImageStore.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                          Text('$ext  $sizeMb MB', style: const TextStyle(color: Colors.grey, fontSize: 11)),
                        ],
                      ),
                    ),
                    const Icon(Icons.more_vert, color: Colors.grey),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              const Text('Tools', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 10),
              GridView.count(
                crossAxisCount: 3,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                children: [
                  _toolTile(Icons.crop, 'Crop', () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => const EditImageScreen()));
                  }),
                  _toolTile(Icons.tune, 'Adjust', () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => const EditImageScreen()));
                  }),
                  _toolTile(Icons.filter_vintage_outlined, 'Filters', () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => const EditImageScreen()));
                  }),
                  _toolTile(Icons.auto_fix_high, 'Enhance', () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => const EditImageScreen()));
                  }),
                  _toolTile(Icons.layers_clear, 'Background\nRemove', () {}),
                  _toolTile(Icons.psychology_outlined, 'AI Analysis', () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => const AiAnalysisScreen()));
                  }),
                ],
              ),
              const Spacer(),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {},
                      style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
                      child: const Text('Save'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6255FC), padding: const EdgeInsets.symmetric(vertical: 14)),
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (context) => const EditImageScreen()));
                      },
                      child: const Text('Continue', style: TextStyle(color: Colors.white)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const CustomBottomNav(currentIndex: 0),
    );
  }

  Widget _toolTile(IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(border: Border.all(color: const Color(0xFFE0E0E0)), borderRadius: BorderRadius.circular(12)),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: const Color(0xFF6255FC)),
            const SizedBox(height: 6),
            Text(label, textAlign: TextAlign.center, style: const TextStyle(fontSize: 11)),
          ],
        ),
      ),
    );
  }
}