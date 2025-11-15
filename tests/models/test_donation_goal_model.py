def test_donation_goal_model(client, app):
    from app.extensions import db
    from app.models.user import User
    from app.models.donation_goal import DonationGoal
    from datetime import date

    user = User(mail="u@x.com", last_name="L", first_name="F")
    db.session.add(user)
    db.session.commit()

    goal = DonationGoal(
        user_id=user.id,
        deadline=date.today(),
        amount=200
    )
    db.session.add(goal)
    db.session.commit()

    found = DonationGoal.query.first()
    assert found.user_id == user.id
    assert found.amount == 200
