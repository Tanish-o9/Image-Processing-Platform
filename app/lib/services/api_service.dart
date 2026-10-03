import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl =
      'https://image-processing-platform.onrender.com';

  static Future<bool> checkHealth() async {
    final res = await http
        .get(Uri.parse('$baseUrl/health'))
        .timeout(const Duration(seconds: 60));
    return res.statusCode == 200;
  }

  static Future<http.Response> _postImage(
    String endpoint,
    Uint8List bytes,
    String fileName, {
    Map<String, String>? fields,
  }) async {
    final request =
        http.MultipartRequest('POST', Uri.parse('$baseUrl$endpoint'));
    request.files.add(
      http.MultipartFile.fromBytes('image', bytes, filename: fileName),
    );
    if (fields != null) request.fields.addAll(fields);
    final streamed = await request.send().timeout(const Duration(seconds: 90));
    return http.Response.fromStream(streamed);
  }

  static Future<dynamic> analyzeImage(Uint8List bytes, String fileName) async {
    final res = await _postImage('/analyze', bytes, fileName);
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception('Analyze failed: ${res.statusCode}');
  }

  static Future<dynamic> recommendSettings(
      Uint8List bytes, String fileName) async {
    final res = await _postImage('/recommend', bytes, fileName);
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception('Recommend failed: ${res.statusCode}');
  }

  // Checks the first bytes of the data to see if it is a real image
  static bool _looksLikeImage(Uint8List b) {
    if (b.length < 4) return false;
    final png = b[0] == 0x89 && b[1] == 0x50;
    final jpg = b[0] == 0xFF && b[1] == 0xD8;
    final gif = b[0] == 0x47 && b[1] == 0x49;
    final riff = b[0] == 0x52 && b[1] == 0x49;
    final bmp = b[0] == 0x42 && b[1] == 0x4D;
    return png || jpg || gif || riff || bmp;
  }

  // Looks inside the server's JSON for the image text or link
  static String? _findString(dynamic v) {
    if (v is String) {
      if (v.startsWith('http') || v.length > 100) return v;
      return null;
    } else if (v is Map) {
      for (final e in v.entries) {
        final k = '${e.key}'.toLowerCase();
        if (k.contains('image') || k.contains('result') || k.contains('output')) {
          final f = _findString(e.value);
          if (f != null) return f;
        }
      }
      for (final e in v.values) {
        final f = _findString(e);
        if (f != null) return f;
      }
    } else if (v is List) {
      for (final e in v) {
        final f = _findString(e);
        if (f != null) return f;
      }
    }
    return null;
  }

  static Uint8List _decodeB64(String s) {
    var t = s.trim();
    if (t.contains(',')) t = t.split(',').last;
    t = t.replaceAll(RegExp(r'\s'), '').replaceAll('-', '+').replaceAll('_', '/');
    while (t.length % 4 != 0) {
      t += '=';
    }
    return base64Decode(t);
  }

  // POST /process -> returns the edited image as bytes
  static Future<Uint8List> processImage(
    Uint8List bytes,
    String fileName,
    Map<String, dynamic> settings,
  ) async {
    final res = await _postImage(
      '/process',
      bytes,
      fileName,
      fields: {'settings': jsonEncode(settings)},
    );

    final type = res.headers['content-type'] ?? 'unknown';
    final preview =
        res.body.length > 80 ? res.body.substring(0, 80) : res.body;
    final info = 'status ${res.statusCode}, type $type, start: $preview';

    if (res.statusCode != 200) {
      throw Exception('Process failed: $info');
    }

    // Case 1: server sent the image itself
    if (_looksLikeImage(res.bodyBytes)) {
      return res.bodyBytes;
    }

    // Case 2: server sent text (base64 or link)
    String? found;
    try {
      found = _findString(jsonDecode(res.body));
    } catch (_) {
      found = res.body.replaceAll('"', '');
    }
    if (found == null) throw Exception('No image in reply: $info');

    Uint8List out;
    if (found.startsWith('http') || found.startsWith('/')) {
      final url = found.startsWith('/') ? '$baseUrl$found' : found;
      final imgRes = await http.get(Uri.parse(url));
      out = imgRes.bodyBytes;
    } else {
      out = _decodeB64(found);
    }

    if (!_looksLikeImage(out)) {
      throw Exception('Reply is not an image: $info');
    }
    return out;
  }
}