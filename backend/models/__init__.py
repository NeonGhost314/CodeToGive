from ..extensions import db

# Importer tous les modèles pour que SQLAlchemy les enregistre
from .user import User
from .fund import Fund
from .transaction import Transaction
from .recurring_subscription import RecurringSubscription
from .global_goal import GlobalGoal
from .video import Video
from .user_video_access import UserVideoAccess
from .achievement import Achievement
from .user_achievement import UserAchievement
from .payment import Payment

# Anciens modèles (à supprimer après migration)
# from .story import Story
# from .chapter import Chapter
# from .donation_pot import DonationPot
# from .donation_goal import DonationGoal
# from .donation import Donation
# from .subscribe import Subscribe
# from .impact_funds import ImpactFunds
# from .donation_items import DonationItems

__all__ = [
    "User",
    "Fund",
    "Transaction",
    "RecurringSubscription",
    "GlobalGoal",
    "Video",
    "UserVideoAccess",
    "Achievement",
    "UserAchievement",
    "Payment",
]
