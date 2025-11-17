import psycopg2

def test_db():
    try:
        conn = psycopg2.connect(
            dbname="athena_hackathon",
            user="postgres",
            password="1234",
            host="localhost",
            port=5432
        )
        cur = conn.cursor()

        # Test simple
        cur.execute("SELECT 1;")
        print("SELECT 1 ->", cur.fetchone())

        # Test sur une table (optionnel)
        cur.execute("SELECT * FROM users LIMIT 1;")  # remplace par ta table
        print("Table test ->", cur.fetchone())

        cur.close()
        conn.close()
        print("Connexion OK")

    except Exception as e:
        print("Erreur :", e)

if __name__ == "__main__":
    test_db()
