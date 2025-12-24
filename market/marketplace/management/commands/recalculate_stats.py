from django.core.management.base import BaseCommand
from marketplace.models import UserProfile, CreatorProfile

class Command(BaseCommand):
    help = 'Recalculates total_spent for users and total_sales for creators based on transaction history'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting statistics recalculation...')

        # Update User Profiles (Buyers)
        user_profiles = UserProfile.objects.all()
        count_users = user_profiles.count()
        self.stdout.write(f'Updating {count_users} user profiles...')
        
        for profile in user_profiles:
            profile.update_total_spent()
            profile.update_assets_count()
            self.stdout.write(f'- Updated User: {profile.user.username}')

        # Update Creator Profiles (Sellers)
        creator_profiles = CreatorProfile.objects.all()
        count_creators = creator_profiles.count()
        self.stdout.write(f'Updating {count_creators} creator profiles...')

        for profile in creator_profiles:
            profile.update_total_sales()
            profile.update_total_created()
            self.stdout.write(f'- Updated Creator: {profile.user.username}')

        self.stdout.write(self.style.SUCCESS('Successfully recalculated all statistics!'))
