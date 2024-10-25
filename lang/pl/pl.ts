export default {
  alert: {
    error: 'Błąd...',
    warning: 'Uwaga!',
    success: 'Sukces!',
    confirm: 'OK',
    cancel: 'Anuluj',
    login: 'Zaloguj się na swoje konto',
  },
  sing: {
    in: {
      alert: {
        missingData: 'Podaj dane logowania!',
      },
      header: 'Zdobywaj szczyty Korony Gór Świętokrzyskich!',
      form: {
        email: 'Email',
        password: 'Hasło',
        submit: 'Zaloguj się',
      },
      noAccount: 'Nie masz konta?',
      register: 'Zarejestruj się',
    },
    up: {
      alert: {
        privacyConsent: 'Musisz zatwierdzić politykę prywatności',
        missingEmail: 'Niepoprawny format adresu email',
        missingData: 'Podaj wymagane dane!',
      },
      header:
        'Zarejestruj się i zacznij zdobywać szczyty Korony Gór Świętokrzyskich już dziś!',
      form: {
        username: 'Nazwa Użytkownika',
        email: 'Email',
        password: 'Hasło',
        consent: {
          header: 'Akceptuj',
          privacyPolicy: 'politykę prywatności',
        },
        submit: 'Utwórz konto',
      },
      registered: 'Masz już konto?',
      login: 'Zaloguj się',
    },
  },
  index: {
    header: {
      main: 'Poznaj region \n i zachwyć się pięknem',
      sub: 'Gór Świętokrzyskich',
    },
    subheader: 'Zdobywaj najwyższe szczyty w najstarszych polskich górach!',
    login: 'Zaloguj się',
    alert: {
      error: 'Nie można zalogować',
      blocked: 'Twoje konto zostało zablokowane',
    },
  },
  home: {
    header: 'witaj ponownie',
    alert: {
      deleteConfirmation: 'Czy chcesz usunąć wpis?',
    },
    suspended: 'Twoje konto jest zawieszone!',
    latest: 'Ostatnio zdobyte:',
    noPosts: {
      header: 'Nikt jeszcze nie zdobył żadnego szczytu...',
      subheader: 'Bądź pierwszy, ruszaj na szlak!',
    },
    buttons: {
      back: 'Wróć',
    },
  },
  newPost: {
    permissions: {
      location: {
        noPermission: 'Nie udzielono dostępu do lokalizacji',
      },
      camera: {
        alert: 'Potrzebna jest zgoda na dostęp do aparatu!',
        button: 'Przyznaj dostęp',
      },
    },
    noPeak: 'W pobliżu nie ma szczytu',
    buttons: {
      back: 'Wróć',
    },
    alreadyVisited: 'Ten szczyt został już przez Ciebie zdobyty',
    add: 'Dodaj wpis',
    closest: 'Najbliższy szczyt:',
    form: {
      description: 'Opis',
      cancel: 'Anuluj',
      submit: 'Zapisz',
    },
  },
  peaks: {
    header: 'Korona Gór Śwętokrzyskich',
    subheader: 'Szczyty do zdobycia',
    search: {
      Header: 'Szukasz',
      noResults: 'Takiego szczytu nie ma w Koronie Gór Świętokrzyskich',
      clear: 'Wyczyść',
    },
  },
  profile: {
    alert: {
      delete: {
        message: 'Czy chcesz usunąć wpis?',
        cancel: 'Anuluj',
        confirm: 'OK',
      },
    },
    suspended: 'Twoje konto jest zawieszone!',
    visited: 'Zdobytych szczytów:',
    empty: {
      message: 'Brak zdobytych szczytów',
      subtitle: 'Ruszaj na szlak!',
    },
  },
  ranking: {
    header: 'Korona Gór Śwętokrzyskich',
    subheader: 'Zdobywcy Odznaki',
    info: 'Zdobyto:',
    empty: {
      message: 'Jeszcze nikomu nie udało się zdobyć wszystkich szczytów.',
      subtitle: 'Wyrusz na szlak i bądź pierwszy!',
    },
  },
  menu: {
    tabs: {
      home: 'Główna',
      profile: 'Profil',
      peaks: 'Szczyty',
      ranking: 'Zdobywcy',
      add: 'Nowy',
    },
    drawer: {
      home: 'Główna',
      add: 'Dodaj wpis',
      logout: 'Wyloguj',
      mainPolicy: 'Regulamin odznaki',
      privacyPolicy: 'Polityka prywatności',
      dashboard: 'Panel',
    },
  },
};
