import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URI", "postgresql://user:password@localhost:5432/management_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
