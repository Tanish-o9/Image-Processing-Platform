import 'dart:async';
import 'package:flutter/material.dart';
import 'package:app/screens/analysis/analysis_report_screen.dart';
import 'package:app/services/api_service.dart';
import 'package:app/services/image_store.dart';

class AnalyzingScreen extends StatefulWidget {
  const AnalyzingScreen({super.key});

  @override
  State<AnalyzingScreen> createState() => _AnalyzingScreenState();
}

class _AnalyzingScreenState extends State<AnalyzingScreen> {
  double progress = 0.0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(milliseconds: 500), (t) {
      if (progress < 0.9 && mounted) {
        setState(() => progress += 0.04);
      }
    });
    _runAnalysis();
  }

  Future<void> _runAnalysis() async {
    try {
      final bytes = ImageStore.bytes;
      if (bytes == null) throw Exception('No image selected');

      final result = await ApiService.analyzeImage(bytes, ImageStore.name);
      ImageStore.analysisResult = result;
      debugPrint('ANALYZE RESPONSE: $result');

      _timer?.cancel();
      if (!mounted) return;
      setState(() => progress = 1.0);
      await Future.delayed(const Duration(milliseconds: 400));
      if (!mounted) return;
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => AnalysisReportScreen()));
    } catch (e) {
      _timer?.cancel();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      Navigator.pop(context);
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

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
                  const Text('Analyzing Image', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: bytes != null
                    ? Image.memory(bytes, height: 200, width: double.infinity, fit: BoxFit.cover)
                    : Image.asset('assets/images/welcome_collage.png', height: 200, width: double.infinity, fit: BoxFit.cover),
              ),
              const SizedBox(height: 20),
              const Center(child: Text('Analyzing your image...', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16))),
              const SizedBox(height: 6),
              const Center(
                child: Text('AI is processing visual information and generating insights.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
              ),
              const SizedBox(height: 16),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(value: progress.clamp(0.0, 1.0), color: const Color(0xFF6255FC), backgroundColor: const Color(0xFFEFEFEF), minHeight: 8),
              ),
              const SizedBox(height: 16),
              _stepRow('Processing Image', progress > 0.2),
              _stepRow('Detecting objects', progress > 0.5),
              _stepRow('Analyzing scene', progress > 0.8),
            ],
          ),
        ),
      ),
    );
  }

  Widget _stepRow(String text, bool done) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(done ? Icons.check_circle : Icons.radio_button_unchecked, color: done ? const Color(0xFF6255FC) : Colors.grey, size: 20),
          const SizedBox(width: 10),
          Text(text),
        ],
      ),
    );
  }
}