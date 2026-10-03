import 'package:flutter/material.dart';
import 'package:app/widgets/custom_bottom_nav.dart';

class SaveExportScreen extends StatefulWidget {
  const SaveExportScreen({super.key});

  @override
  State<SaveExportScreen> createState() => _SaveExportScreenState();
}

class _SaveExportScreenState extends State<SaveExportScreen> {
  String format = 'JPG';
  String quality = 'Standard';

  @override
  Widget build(BuildContext context) {
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
                  const Text('Save & Export', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.asset('assets/images/welcome_collage.png', height: 180, width: double.infinity, fit: BoxFit.cover),
              ),
              const SizedBox(height: 16),
              const Text('Export Format', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Row(
                children: ['JPG', 'PNG', 'WEBP'].map((f) => Expanded(child: _chip(f, format, (v) => setState(() => format = v)))).toList(),
              ),
              const SizedBox(height: 16),
              const Text('Quality', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Row(
                children: ['Standard', 'High', 'Maximum'].map((q) => Expanded(child: _chip(q, quality, (v) => setState(() => quality = v)))).toList(),
              ),
              const SizedBox(height: 16),
              const Text('Estimated file size: 8.9 Mb', style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 10),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(8)),
                child: const Text('Your image is ready to export.', textAlign: TextAlign.center, style: TextStyle(color: Colors.green)),
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6255FC), padding: const EdgeInsets.symmetric(vertical: 14)),
                  onPressed: () {},
                  icon: const Icon(Icons.download, color: Colors.white, size: 18),
                  label: const Text('Export Image', style: TextStyle(color: Colors.white)),
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const CustomBottomNav(currentIndex: 1),
    );
  }

  Widget _chip(String label, String selected, ValueChanged<String> onTap) {
    final isSelected = label == selected;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: InkWell(
        onTap: () => onTap(label),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFEDE9FE) : Colors.white,
            border: Border.all(color: isSelected ? const Color(0xFF6255FC) : const Color(0xFFE0E0E0)),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(label, style: TextStyle(color: isSelected ? const Color(0xFF6255FC) : Colors.black87, fontWeight: FontWeight.w600, fontSize: 12)),
        ),
      ),
    );
  }
}