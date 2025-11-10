from translator import Translator

def main():
    t = Translator("en")
    print("Current language:", t.lang)
    print("Greeting:", t.t("greeting"))
    print("Farewell:", t.t("farewell"))

    print("\nSwitching language to Hindi...\n")
    t.set_language("hi")
    print("Current language:", t.lang)
    print("Greeting:", t.t("greeting"))
    print("Farewell:", t.t("farewell"))

if __name__ == "__main__":
    main()
