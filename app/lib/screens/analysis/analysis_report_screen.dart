import 'package:flutter/material.dart';
import 'package:gal/gal.dart';
import 'package:share_plus/share_plus.dart';
import 'package:app/widgets/custom_bottom_nav.dart';
import 'package:app/services/image_store.dart';

class AnalysisReportScreen extends StatefulWidget {
  const AnalysisReportScreen({super.key});

  @override
  State<AnalysisReportScreen> createState() => _AnalysisReportScreenState();
}

class _AnalysisReportScreenState extends State<AnalysisReportScreen> {
  int tabIndex = 0;
  final tabs = ['Summary', 'Objective', 'Colors', 'Details'];

  Map<String, dynamic> get r {
    final data = ImageStore.analysisResult;
    return data is Map ? Map<String, dynamic>.from(data) : {};
  }

  String _num(String key) {
    final v = r[key];
    return v is num ? v.toStringAsFixed(1) : '-';
  }

  String _pct(String key) {
    final v = r[key];
    return v is num ? '${v.toStringAsFixed(1)}%' : '-';
  }

  void _msg(String text) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));
  }

  String _reportText() {
    return 'AI Image Analysis Report\n'
        'Brightness: ${_num('brightness')}\n'
        'Contrast: ${_num('contrast')}\n'
        'Sharpness: ${_num('sharpness')}\n'
        'Saturation: ${_num('saturation')}\n'
        'Noise: ${_num('noise')}\n'
        'Underexposed: ${_pct('underexposed_pct')}\n'
        'Overexposed: ${_pct('overexposed_pct')}\n'
        'Condition: ${r['is_dark'] == true ? 'Dark' : 'Well lit'}, '
        '${r['is_blurry'] == true ? 'Blurry' : 'Sharp'}';
  }

  Future<void> _save() async {
    final img = ImageStore.bytes;
    if (img == null) {
      _msg('No image to save');
      return;
    }
    try {
      await Gal.putImageBytes(img);
      if (!mounted) return;
      _msg('Saved to your gallery');
    } catch (e) {
      if (!mounted) return;
      _msg('Could not save: $e');
    }
  }

  Future<void> _share() async {
    final img = ImageStore.bytes;
    try {
      final isJpg = img != null && img.length > 1 && img[0] == 0xFF;
      await SharePlus.instance.share(
        ShareParams(
          text: _reportText(),
          files: img == null
              ? null
              : [
                  XFile.fromData(
                    img,
                    mimeType: isJpg ? 'image/jpeg' : 'image/png',
                    name: isJpg ? 'analyzed_image.jpg' : 'analyzed_image.png',
                  ),
                ],
        ),
      );
    } catch (e) {
      if (!mounted) return;
      _msg('Could not share: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final bytes = ImageStore.bytes;
    final isDark = r['is_dark'] == true;
    final isBlurry = r['is_blurry'] == true;

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
                  const Text('AI Analysis Report', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ],
              ),
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: bytes != null
                    ? Image.memory(bytes, height: 150, width: double.infinity, fit: BoxFit.cover)
                    : Image.asset('assets/images/welcome_collage.png', height: 150, width: double.infinity, fit: BoxFit.cover),
              ),
              const SizedBox(height: 10),
              Row(
                children: List.generate(tabs.length, (index) {
                  final selected = index == tabIndex;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(tabs[index]),
                      selected: selected,
                      selectedColor: const Color(0xFF6255FC),
                      labelStyle: TextStyle(color: selected ? Colors.white : Colors.black87, fontSize: 12),
                      onSelected: (_) => setState(() => tabIndex = index),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 14),
              Expanded(
                child: ListView(
                  children: [
                    const Text('Image Overview', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: _infoTile(Icons.wb_sunny_outlined, 'Brightness', _num('brightness'), Colors.orange)),
                        const SizedBox(width: 8),
                        Expanded(child: _infoTile(Icons.contrast, 'Contrast', _num('contrast'), Colors.purple)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: _infoTile(Icons.hd_outlined, 'Sharpness', _num('sharpness'), Colors.blue)),
                        const SizedBox(width: 8),
                        Expanded(child: _infoTile(Icons.palette_outlined, 'Saturation', _num('saturation'), Colors.green)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Text('Image Condition', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: [
                        isDark ? 'Dark image' : 'Well lit',
                        isBlurry ? 'Blurry' : 'Sharp',
                      ].map((tag) {
                        return Chip(label: Text(tag, style: const TextStyle(fontSize: 12)), backgroundColor: const Color(0xFFF5F5F7));
                      }).toList(),
                    ),
                    const SizedBox(height: 16),
                    const Text('Exposure & Noise', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: _infoTile(Icons.brightness_low, 'Underexposed', _pct('underexposed_pct'), Colors.indigo)),
                        const SizedBox(width: 8),
                        Expanded(child: _infoTile(Icons.brightness_high, 'Overexposed', _pct('overexposed_pct'), Colors.amber)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: _infoTile(Icons.grain, 'Noise', _num('noise'), Colors.teal)),
                        const SizedBox(width: 8),
                        const Expanded(child: SizedBox()),
                      ],
                    ),
                  ],
                ),
              ),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _share,
                      icon: const Icon(Icons.share_outlined, size: 16),
                      label: const Text('Share'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6255FC)),
                      onPressed: _save,
                      icon: const Icon(Icons.save_outlined, size: 16, color: Colors.white),
                      label: const Text('Save', style: TextStyle(color: Colors.white)),
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

  Widget _infoTile(IconData icon, String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(color: const Color(0xFFF5F5F7), borderRadius: BorderRadius.circular(10)),
      child: Row(
        children: [
          Icon(icon, color: color, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                Text(value, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}