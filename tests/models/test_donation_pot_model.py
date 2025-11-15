def test_donation_pot_model(client, app):
    from app.extensions import db
    from app.models.story import Story
    from app.models.donation_pot import DonationPot

    story = Story(title="Test", description="X")
    db.session.add(story)
    db.session.commit()

    pot = DonationPot(
        story_id=story.id,
        name="Pot A",
        donation_goal=100,
        global_amount=0
    )
    db.session.add(pot)
    db.session.commit()

    found = DonationPot.query.first()
    assert found.story_id == story.id
    assert found.name == "Pot A"
    assert found.donation_goal == 100
