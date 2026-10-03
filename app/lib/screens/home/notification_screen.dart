import 'package:flutter/material.dart';
import 'package:app/widgets/custom_bottom_nav.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final notifications = [
      {'icon': Icons.image_outlined, 'color': const Color(0xFF6255FC), 'title': 'Image analysis completed', 'subtitle': 'Your image "Mountain View.jpg" has been analyzed. View results now.'},
      {'icon': Icons.check_circle_outline, 'color': Colors.green, 'title': 'Your image has been successfully processed', 'subtitle': '"City Skyline.jpg" is ready to view in your gallery.'},
      {'icon': Icons.auto_awesome_outlined, 'color': const Color(0xFF38B8FD), 'title': 'New AI feature available', 'subtitle': 'Background removal is now available in our latest update!'},
      {'icon': Icons.folder_outlined, 'color': const Color(0xFF6255FC), 'title': 'Project saved successfully', 'subtitle': 'Your project "Dog Portrait" has been saved to your gallery.'},
    ];

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => Navigator.pop(context)),
                      const Text('Notification', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  TextButton(onPressed: () {}, child: const Text('Mark all as read')),
                ],
              ),
              Expanded(
                child: ListView.separated(
                  itemCount: notifications.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = notifications[index];
                    return Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(border: Border.all(color: const Color(0xFFE0E0E0)), borderRadius: BorderRadius.circular(12)),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: (item['color'] as Color).withOpacity(0.15), borderRadius: BorderRadius.circular(8)),
                            child: Icon(item['icon'] as IconData, color: item['color'] as Color, size: 18),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item['title'] as String, style: const TextStyle(fontWeight: FontWeight.w600)),
                                const SizedBox(height: 4),
                                Text(item['subtitle'] as String, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const CustomBottomNav(currentIndex: 1),
    );
  }
}