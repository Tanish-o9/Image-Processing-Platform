import 'package:flutter/material.dart';
import 'package:app/widgets/custom_bottom_nav.dart';
import 'package:app/services/auth_api.dart';
import 'package:app/services/image_store.dart';
import 'package:app/screens/authentication/welcome_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  void _logout(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Log Out'),
        content: const Text('Are you sure you want to log out of ImageRise?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.redAccent,
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              await AuthApi.logout();
              ImageStore.reset();
              if (!context.mounted) return;
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const WelcomeScreen()),
                (route) => false,
              );
            },
            child: const Text('Log Out', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final name = AuthApi.userName.trim().isNotEmpty
        ? AuthApi.userName
        : 'Demo User';
    final email = AuthApi.userEmail.trim().isNotEmpty
        ? AuthApi.userEmail
        : 'demo@test.com';

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              Center(
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 42,
                      backgroundColor: const Color(0xFFEDE9FE),
                      child: Text(
                        name.isNotEmpty ? name[0].toUpperCase() : 'U',
                        style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF6255FC),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      name,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      email,
                      style: const TextStyle(color: Colors.grey, fontSize: 13),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: AuthApi.useLocal
                            ? const Color(0xFFDCFCE7)
                            : const Color(0xFFEDE9FE),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        AuthApi.useLocal
                            ? '● Local Offline Mode'
                            : '● Connected Mode',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AuthApi.useLocal
                              ? const Color(0xFF15803D)
                              : const Color(0xFF6255FC),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: _statCard(
                      '${ImageStore.recentImages.length}',
                      'Recent Projects',
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(child: _statCard('86', 'Processed')),
                  const SizedBox(width: 10),
                  Expanded(child: _statCard('42', 'AI Insights')),
                ],
              ),
              const SizedBox(height: 20),
              const Text(
                'Account Settings',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              _settingsTile(Icons.person_outline, 'Personal Profile'),
              _settingsTile(Icons.notifications_none, 'Notifications'),
              _settingsTile(Icons.shield_outlined, 'Security & Privacy'),
              const SizedBox(height: 20),
              const Text(
                'Preferences',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              _settingsTile(
                Icons.dark_mode_outlined,
                'Appearance',
                trailing: 'Light',
              ),
              _settingsTile(Icons.language, 'Language', trailing: 'English'),
              _settingsTile(Icons.help_outline, 'Help & Support'),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.redAccent,
                    side: const BorderSide(color: Colors.redAccent),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () => _logout(context),
                  icon: const Icon(Icons.logout, size: 18),
                  label: const Text(
                    'Log Out',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const CustomBottomNav(currentIndex: 4),
    );
  }

  Widget _statCard(String value, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F5F7),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(color: Colors.grey, fontSize: 11),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _settingsTile(IconData icon, String title, {String? trailing}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Icon(icon, color: Colors.grey, size: 20),
          const SizedBox(width: 12),
          Expanded(child: Text(title, style: const TextStyle(fontSize: 14))),
          if (trailing != null)
            Padding(
              padding: const EdgeInsets.only(right: 6),
              child: Text(
                trailing,
                style: const TextStyle(color: Colors.grey, fontSize: 13),
              ),
            ),
          const Icon(Icons.chevron_right, color: Colors.grey, size: 18),
        ],
      ),
    );
  }
}