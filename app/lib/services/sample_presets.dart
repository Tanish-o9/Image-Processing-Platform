import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

class SamplePreset {
  final String title;
  final String subtitle;
  final String assetFallback;
  final String? remoteUrl;

  const SamplePreset({
    required this.title,
    required this.subtitle,
    required this.assetFallback,
    this.remoteUrl,
  });

  Future<Uint8List> loadBytes() async {
    if (remoteUrl != null) {
      try {
        final res = await http
            .get(Uri.parse(remoteUrl!))
            .timeout(const Duration(seconds: 4));
        if (res.statusCode == 200 && res.bodyBytes.length > 500) {
          return res.bodyBytes;
        }
      } catch (_) {}
    }
    // Fallback to local high-res asset
    final byteData = await rootBundle.load(assetFallback);
    return byteData.buffer.asUint8List();
  }
}

class SamplePresets {
  static const List<SamplePreset> presets = [
    SamplePreset(
      title: 'Nature Landscape',
      subtitle: 'Mountains & lake view',
      assetFallback: 'assets/images/welcome_collage.png',
      remoteUrl:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    ),
    SamplePreset(
      title: 'Portrait Photo',
      subtitle: 'Clear facial lighting',
      assetFallback: 'assets/images/welcome_collage.png',
      remoteUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    ),
    SamplePreset(
      title: 'City Architecture',
      subtitle: 'Urban contrast details',
      assetFallback: 'assets/images/welcome_collage.png',
      remoteUrl:
          'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&q=80',
    ),
    SamplePreset(
      title: 'Studio Showcase',
      subtitle: 'Product & studio lighting',
      assetFallback: 'assets/images/welcome_collage.png',
      remoteUrl:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    ),
  ];
}
