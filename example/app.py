from translator import Translator


def main():
    t = Translator(lang="en")

    print(t.t("greeting"))
    print(t.t("farewell"))

    t.set_language("hi")
    print(t.t("greeting"))
    print(t.t("farewell"))


if __name__ == "__main__":
    main()
