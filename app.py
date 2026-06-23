# app.py
from flask import Flask, render_template, jsonify
import json
import os
from datetime import datetime, date
from config import START_DATE, COUPLE_NAMES, HERO_HEADLINE

app = Flask(__name__)

# Load love notes from JSON file
def load_love_notes():
    try:
        with open('data/love_notes.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Get list of gallery images
def get_gallery_images():
    gallery_path = os.path.join('static', 'images', 'gallery')
    if os.path.exists(gallery_path):
        extensions = ('.jpg', '.jpeg', '.png', '.gif')
        images = [f for f in os.listdir(gallery_path) 
                  if f.lower().endswith(extensions)]
        return sorted(images)
    return []

# Calculate relationship duration
def get_relationship_duration(start_date_str):
    start = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    now = date.today()
    delta = now - start
    
    # Compute years, months, days
    years = now.year - start.year
    months = now.month - start.month
    days = now.day - start.day
    if days < 0:
        months -= 1
        # approximate days in previous month
        prev_month = (now.replace(day=1) - timedelta(days=1)).day
        days += prev_month
    if months < 0:
        years -= 1
        months += 12
    
    # Total seconds for real-time timer
    total_seconds = int(delta.total_seconds())
    return {
        'years': years,
        'months': months,
        'days': days,
        'total_seconds': total_seconds
    }

from datetime import timedelta

# Calculate next anniversary and countdown
def get_anniversary_info(start_date_str):
    start = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    today = date.today()
    # next anniversary this year?
    anniversary_this_year = date(today.year, start.month, start.day)
    if anniversary_this_year < today:
        anniversary_next = date(today.year + 1, start.month, start.day)
    else:
        anniversary_next = anniversary_this_year
    days_until = (anniversary_next - today).days
    
    # Countdown in seconds (for timer)
    seconds_until = int((anniversary_next - today).total_seconds())
    return {
        'days': days_until,
        'seconds': seconds_until,
        'is_anniversary': days_until == 0,
        'next_date': anniversary_next.strftime('%B %d, %Y')
    }

@app.route('/')
def index():
    love_notes = load_love_notes()
    gallery_images = get_gallery_images()
    ann_info = get_anniversary_info(START_DATE)
    duration = get_relationship_duration(START_DATE)
    
    return render_template('index.html',
                           couple_names=COUPLE_NAMES,
                           headline=HERO_HEADLINE,
                           love_notes=love_notes,
                           gallery_images=gallery_images,
                           start_date=START_DATE,
                           ann_info=ann_info,
                           duration=duration)

# API endpoint to get current time data (for real-time updates)
@app.route('/api/timer')
def timer_data():
    duration = get_relationship_duration(START_DATE)
    ann_info = get_anniversary_info(START_DATE)
    return jsonify({
        'duration': duration,
        'anniversary': ann_info
    })

if __name__ == '__main__':
    app.run(debug=True)
