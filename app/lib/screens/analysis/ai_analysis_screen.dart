import 'package:flutter/material.dart';
import 'package:app/widgets/custom_bottom_nav.dart';
import 'package:app/screens/analysis/analyzing_screen.dart';
import 'package:app/services/image_store.dart';

class AiAnalysisScreen extends StatefulWidget {
  const AiAnalysisScreen({super.key});

  @override
  State<AiAnalysisScreen> createState() => _AiAnalysisScreenState();
}

class _AiAnalysisScreenState extends State<AiAnalysisScreen> {
  bool objectDetection = true, sceneAnalysis = false, imageQuality = false;

  @override
  Widget build(BuildContext context) {
    final bytes = ImageStore.bytes;
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
                  const Text('AI Analysis', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: bytes != null
                    ? Image.memory(bytes, height: 160, width: double.infinity, fit: BoxFit.cover)
                    : Image.asset('assets/images/welcome_collage.png', height: 160, width: double.infinity, fit: BoxFit.cover),
              ),
              const SizedBox(height: 16),
              const Text('Choose what you want AI to analyze', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              _checkTile('Object Detection', 'Detect and identify objects in your image.', objectDetection, (v) => setState(() => objectDetection = v!)),
              _checkTile('Scene Analysis', 'Understand the scene, location and environment.', sceneAnalysis, (v) => setState(() => sceneAnalysis = v!)),
              _checkTile('Image Quality', 'Check sharpness, clarity and overall quality.', imageQuality, (v) => setState(() => imageQuality = v!)),
              const Spacer(),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: const Color(0xFFF5F5F7), borderRadius: BorderRadius.circular(10)),
                child: const Text('AI will analyze your image and generate detailed visual insights.', style: TextStyle(fontSize: 12, color: Colors.grey)),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6255FC), padding: const EdgeInsets.symmetric(vertical: 14)),
                  onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => const AnalyzingScreen()));
                  },
                  child: const Text('Start AI Analysis', style: TextStyle(color: Colors.white)),
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const CustomBottomNav(currentIndex: 0),
    );
  }

  Widget _checkTile(String title, String subtitle, bool value, ValueChanged<bool?> onChanged) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(border: Border.all(color: const Color(0xFFE0E0E0)), borderRadius: BorderRadius.circular(10)),
      child: Row(
        children: [
          Checkbox(value: value, activeColor: const Color(0xFF6255FC), onChanged: onChanged),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
                Text(subtitle, style: const TextStyle(color: Colors.grey, fontSize: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}