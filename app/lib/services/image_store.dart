import 'dart:typed_data';

class RecentImageItem {
  final String name;
  final Uint8List bytes;
  final DateTime timestamp;

  RecentImageItem({
    required this.name,
    required this.bytes,
    required this.timestamp,
  });
}

class ImageStore {
  static Uint8List? bytes;
  static String name = 'image.jpg';
  static dynamic analysisResult;
  static Uint8List? processedBytes;
  static Map<String, dynamic> lastSettings = {};

  static final List<RecentImageItem> recentImages = [];

  static void setImage(Uint8List newBytes, String fileName) {
    bytes = newBytes;
    name = fileName;
    processedBytes = null;
    analysisResult = null;
    lastSettings = {};

    recentImages.removeWhere((item) => item.name == fileName);
    recentImages.insert(
      0,
      RecentImageItem(
        name: fileName,
        bytes: newBytes,
        timestamp: DateTime.now(),
      ),
    );
    if (recentImages.length > 10) {
      recentImages.removeLast();
    }
  }

  static void reset() {
    bytes = null;
    name = 'image.jpg';
    analysisResult = null;
    processedBytes = null;
    lastSettings = {};
  }
}