import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:gal/gal.dart';
import 'package:share_plus/share_plus.dart';
import 'package:app/widgets/custom_bottom_nav.dart';
import 'package:app/services/image_store.dart';

class BeforeAfterScreen extends StatelessWidget {
  const BeforeAfterScreen({super.key});

  String _fmt(dynamic v) {
    final n = v is num ? v.toInt() : 0;
    return n >= 0 ? '+$n' : '$n';
  }

  void _msg(BuildContext context, String text) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));
  }

  Future<void> _saveToGallery(BuildContext context) async {
    final img = ImageStore.processedBytes;
    if (img == null) {
      _msg(context, 'No edited image to save yet');
      return;
    }
    try {
      await Gal.putImageBytes(img);
      if (!context.mounted) return;
      _msg(context, 'Saved to your gallery');
    } catch (e) {
      if (!context.mounted) return;
      _msg(context, 'Could not save: $e');
    }
  }

  Future<void> _share(BuildContext context) async {
    final img = ImageStore.processedBytes;
    if (img == null) {
      _msg(context, 'No edited image to share yet');
      return;
    }
    final isJpg = img.length > 1 && img[0] == 0xFF;
    try {
      await SharePlus.instance.share(
        ShareParams(
          text: 'Edited with Image Processing Platform',
          files: [
            XFile.fromData(
              img,
              mimeType: isJpg ? 'image/jpeg' : 'image/png',
              name: isJpg ? 'edited_image.jpg' : 'edited_image.png',
            ),
          ],
        ),
      );
    } catch (e) {
      if (!context.mounted) return;
      _msg(context, 'Could not share: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = ImageStore.lastSettings;

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
                  const Text('Before & After', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              Row(
                children: [
                  Expanded(child: _labeledImage('Before', ImageStore.bytes)),
                  const SizedBox(width: 10),
                  Expanded(child: _labeledImage('After', ImageStore.processedBytes)),
                ],
              ),
              const SizedBox(height: 20),
              const Text('AI Enhancements', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 10),
              _statRow('Brightness', _fmt(s['brightness'])),
              _statRow('Contrast', _fmt(s['contrast'])),
              _statRow('Saturation', _fmt(s['saturation'])),
              _statRow('Sharpness', _fmt(s['sharpen'])),
              const Spacer(),
              Row(
                children: [
                  Expanded(child: OutlinedButton.icon(onPressed: () => _share(context), icon: const Icon(Icons.share_outlined, size: 16), label: const Text('Share'))),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6255FC)),
                      onPressed: () => _saveToGallery(context),
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

  Widget _labeledImage(String label, Uint8List? bytes) {
    return Stack(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: bytes != null
              ? Image.memory(bytes, height: 220, width: double.infinity, fit: BoxFit.cover)
              : Image.asset('assets/images/welcome_collage.png', height: 220, width: double.infinity, fit: BoxFit.cover),
        ),
        Positioned(
          top: 8,
          left: 8,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(color: const Color(0xFF6255FC), borderRadius: BorderRadius.circular(8)),
            child: Text(label, style: const TextStyle(color: Colors.white, fontSize: 12)),
          ),
        ),
      ],
    );
  }

  Widget _statRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(value, style: const TextStyle(color: Color(0xFF6255FC), fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}