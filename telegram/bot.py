import telebot
import os
from dotenv import load_dotenv
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton  
import requests  
import io
from telebot import types

load_dotenv()

bot = telebot.TeleBot(os.getenv("BOT_TOKEN"))

goal_to_id_dict = {}
    

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    user_name = message.from_user.username
    API_BASE_URL = os.getenv("API_BASE_URL")
    response = requests.get(f"{API_BASE_URL}/api/telegram/{user_name}")
    if response.status_code == 404 or response.json() is None:
        bot.send_message(message.chat.id, "Please sign up")
    else:
        user_id = response.json()["user_id"]
        response = requests.get(f"{API_BASE_URL}/api/goals/user/{user_id}")
        goals = response.json()
        goals_message = "Here are your active goals:\n"
        i = 1
        for goal in goals:
            goals_message += f"{i}. {goal['name']} - {goal['description']}\n"
            i += 1
        bot.send_message(message.chat.id, f"Hello {user_name}, You already have an account.\n{goals_message}")
    
@bot.message_handler(commands=['hello'])
def hello(message):
    bot.reply_to(message, "Hello, how are you doing?")
    
selected_goals = {}

@bot.callback_query_handler(func=lambda call: True)
def handle_callback_query(call):
    user_id = call.from_user.id
    goal_id = call.data
    goal_name = call.message.reply_markup.keyboard[0][0].text  # Adjusted to keyboard
    selected_goals[user_id] = [goal_to_id_dict[goal_name], goal_name]  # Store the selected goal
    bot.send_message(call.message.chat.id, f"Selected goal: {goal_name}. Please upload your daily progress photo")

@bot.message_handler(commands=['mygoals'])
def my_goals(message):
    user_name = message.from_user.username
    API_BASE_URL = os.getenv("API_BASE_URL")
    response = requests.get(f"{API_BASE_URL}/api/telegram/{user_name}")
    if response.status_code == 404 or response.json() is None:
        bot.send_message(message.chat.id, "Please sign up")
    else:
        user_id = response.json()["user_id"]
        response = requests.get(f"{API_BASE_URL}/api/goals/user/{user_id}")
        goals = response.json()
    markup = InlineKeyboardMarkup()
    for goal in goals:
        goal_to_id_dict[goal["name"]] = goal["id"]
        markup.add(InlineKeyboardButton(goal["name"], callback_data=goal["id"]))
    
    bot.send_message(message.chat.id, "Choose one of the following goals to upload your daily progress photos!", reply_markup=markup)

@bot.message_handler(content_types=['photo'])
def handle_photo(message):
    goal = selected_goals[message.from_user.id]
    file_id = message.photo[-1].file_id
    file_info = bot.get_file(file_id)
    file = bot.download_file(file_info.file_path)
    
    files = {'photo': (file_info.file_path, io.BytesIO(file), 'multipart/form-data')}
    goal_id = selected_goals[message.from_user.id][0]
    API_BASE_URL = os.getenv("API_BASE_URL")
    response = requests.post(f"{API_BASE_URL}/api/goals/{goal_id}/upload-photo", files=files)
    
    if response.status_code == 200:
        print(response.json())
        bot.send_message(message.chat.id, f"Thank you for uploading your daily progress photos for {goal[1]}!")
    else:
        bot.send_message(message.chat.id, "Failed to upload the photo. Please try again.")

bot.infinity_polling()