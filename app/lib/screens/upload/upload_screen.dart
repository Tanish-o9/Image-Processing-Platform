import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:app/widgets/custom_bottom_nav.dart';
import 'package:app/screens/processing/workspace_screen.dart';
import 'package:app/services/image_store.dart';
import 'package:app/services/sample_presets.dart';

class UploadScreen extends StatefulWidget {
  const UploadScreen({super.key});

  @override
  State<UploadScreen> createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  bool _loading = false;
  String? _statusText;

  Future<void> _pickImage(ImageSource source) async {
    try {
      setState(() {
        _loading = true;
        _statusText = source == ImageSource.camera
            ? 'Opening camera...'
            : 'Connecting to gallery...';
      });

      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: source,
        imageQuality: 95,
      );

      if (picked == null) {
        if (mounted) {
          setState(() {
            _loading = false;
            _statusText = null;
          });
        }
        return;
      }

      final bytes = await picked.readAsBytes();
      ImageStore.setImage(bytes, picked.name);

      if (!mounted) return;
      setState(() {
        _loading = false;
        _statusText = null;
      });

      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const WorkspaceScreen()),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _statusText = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Could not open ${source == ImageSource.camera ? "camera" : "gallery"}: $e\nTry selecting a Sample Preset below.',
          ),
          action: SnackBarAction(
            label: 'Load Sample',
            onPressed: () => _loadPreset(SamplePresets.presets.first),
          ),
        ),
      );
    }
  }

  Future<void> _loadPreset(SamplePreset preset) async {
    try {
      setState(() {
        _loading = true;
        _statusText = 'Loading ${preset.title}...';
      });

      final bytes = await preset.loadBytes();
      final fileName = '${preset.title.replaceAll(" ", "_").toLowerCase()}.jpg';
      ImageStore.setImage(bytes, fileName);

      if (!mounted) return;
      setState(() {
        _loading = false;
        _statusText = null;
      });

      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const WorkspaceScreen()),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _statusText = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not load sample: $e')),
      );
    }
  }

  void _openRecent(RecentImageItem item) {
    ImageStore.setImage(item.bytes, item.name);
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const WorkspaceScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final recentList = ImageStore.recentImages;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Text(
                    'Upload Image',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              const Text(
                'Upload an image from your device or test instantly with a sample preset.',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 16),

              // Upload Dropzone Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: const Color(0xFFE0E0E0)),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.02),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: const Color(0xFFEDE9FE),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.cloud_upload_outlined,
                        size: 30,
                        color: Color(0xFF6255FC),
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Select an image to process',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Supports JPG, PNG, WEBP (Max 25 MB)',
                      style: TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                    const SizedBox(height: 16),
                    if (_loading) ...[
                      const CircularProgressIndicator(color: Color(0xFF6255FC)),
                      const SizedBox(height: 8),
                      Text(
                        _statusText ?? 'Processing...',
                        style: const TextStyle(
                          color: Color(0xFF6255FC),
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 8),
                    ] else ...[
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF6255FC),
                                padding:
                                    const EdgeInsets.symmetric(vertical: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              onPressed: () => _pickImage(ImageSource.gallery),
                              icon: const Icon(
                                Icons.photo_library,
                                size: 18,
                                color: Colors.white,
                              ),
                              label: const Text(
                                'Gallery',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: OutlinedButton.icon(
                              style: OutlinedButton.styleFrom(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 12),
                                side: const BorderSide(
                                  color: Color(0xFF6255FC),
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              onPressed: () => _pickImage(ImageSource.camera),
                              icon: const Icon(
                                Icons.camera_alt,
                                size: 18,
                                color: Color(0xFF6255FC),
                              ),
                              label: const Text(
                                'Camera',
                                style: TextStyle(
                                  color: Color(0xFF6255FC),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),

              const SizedBox(height: 22),

              // Sample Presets (Fixes "no photos on emulator/gallery" problem)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text(
                    'Sample Presets (Instant Test)',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Text(
                    'Tap to edit',
                    style: TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: SamplePresets.presets.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  childAspectRatio: 1.5,
                ),
                itemBuilder: (context, index) {
                  final preset = SamplePresets.presets[index];
                  return InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap: _loading ? null : () => _loadPreset(preset),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8F9FA),
                        border: Border.all(color: const Color(0xFFE0E0E0)),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEDE9FE),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Icon(
                                  Icons.image,
                                  color: Color(0xFF6255FC),
                                  size: 16,
                                ),
                              ),
                              const Spacer(),
                              const Icon(
                                Icons.arrow_forward_ios,
                                size: 12,
                                color: Colors.grey,
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            preset.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                          Text(
                            preset.subtitle,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: Colors.grey,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),

              const SizedBox(height: 22),

              // Recent Uploads / Sessions
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Recent Uploads',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  if (recentList.isNotEmpty)
                    Text(
                      '${recentList.length} items',
                      style: const TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                ],
              ),
              const SizedBox(height: 10),

              if (recentList.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F7),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: const [
                      Icon(
                        Icons.photo_outlined,
                        size: 32,
                        color: Colors.grey,
                      ),
                      SizedBox(height: 8),
                      Text(
                        'No previous uploads yet',
                        style: TextStyle(color: Colors.grey, fontSize: 13),
                      ),
                      Text(
                        'Choose an image above or tap any Sample Preset to begin',
                        style: TextStyle(color: Colors.grey, fontSize: 11),
                      ),
                    ],
                  ),
                )
              else
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: recentList.length,
                  gridDelegate:
                      const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                    childAspectRatio: 1.1,
                  ),
                  itemBuilder: (context, index) {
                    final item = recentList[index];
                    return InkWell(
                      borderRadius: BorderRadius.circular(12),
                      onTap: () => _openRecent(item),
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE0E0E0)),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              Image.memory(
                                item.bytes,
                                fit: BoxFit.cover,
                              ),
                              Positioned(
                                bottom: 0,
                                left: 0,
                                right: 0,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 4,
                                    horizontal: 6,
                                  ),
                                  color: Colors.black.withOpacity(0.55),
                                  child: Text(
                                    item.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const CustomBottomNav(currentIndex: 0),
    );
  }
}