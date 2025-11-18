from translator import Translator

tr = Translator(lang='en')
print(tr.t('greeting'))  # Output: Hello
print(tr.t('farewell'))  # Output: Goodbye

tr.load_language('hi')
print(tr.t('greeting'))  # Output: नमस्ते
print(tr.t('farewell'))  # Output: अलविदा