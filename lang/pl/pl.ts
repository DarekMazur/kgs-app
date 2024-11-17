export default {
  alert: {
    error: 'Błąd...',
    warning: 'Uwaga!',
    success: 'Sukces!',
    confirm: 'OK',
    cancel: 'Anuluj',
    login: 'Zaloguj się na swoje konto',
  },
  sign: {
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
        weakPassword:
          'Twoje hasło jest zbyt łatwe do złamania. Dopisz coś do niego, aby było dłuższe. Możesz np. ułożyć jakieś zdanie.',
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
    confirm: {
      title: 'Konto nieaktywne',
      message:
        'Sprawdź podany przy rejestracji adres email i kliknij w link aktywacyjny.',
      spam: 'Jeśli nie widzisz wiadomości, sprawdź w spamie.',
      resend: 'Uzyskaj nowy kod aktywacyjny',
      back: 'Wróc',
    },
    landing: {
      title: 'Konto utworzone!',
      message:
        'Na adres email, podany przy rejestracji otrzymasz wiadomość z linkiem aktywacyjnym. Jeśli nie zobaczysz jej w ciągu najbliższych kilkunastu minut sprawdź folder span w swojej poczcie.',
      back: 'Wróc',
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
  post: {
    new: {
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
    edit: {
      alert: {
        success: '',
      },
      form: {
        title: 'Edytuj wpis:',
        description: 'Opis',
        submit: 'Zapisz',
      },
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
    single: {
      title: 'Szczyt zdobyli:',
      noUsers: 'Bądź pierwszy!',
    },
  },
  profile: {
    edit: {
      alert: {
        cancel: 'Anulowano',
        weakPassword:
          'Twoje hasło jest zbyt łatwe do złamania. Dopisz coś do niego, aby było dłuższe. Możesz np. ułożyć jakieś zdanie.',
        update: {
          success: 'Dane zaktualizowano poprawnie',
          error: 'nie udało się zaktualizować:',
        },
      },
      form: {
        title: 'Edytuj informacje',
        username: 'Nazwa Użytkownika',
        email: 'Email',
        password: 'Hasło',
        avatar: 'Zdjęcie',
        name: 'Imię',
        lastName: 'Nazwisko',
        description: 'Opis',
        submit: 'Zapisz',
        removeAvatar: 'Usuń avatar',
      },
    },
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
  messages: {
    title: 'Wiadomości',
    unread: 'Nieprzeczytane',
    empty: 'Brak wiadomości',
  },
  menu: {
    tabs: {
      home: 'Główna',
      peaks: 'Szczyty',
      ranking: 'Zdobywcy',
      add: 'Nowy',
      messages: 'Poczta',
    },
    drawer: {
      profile: 'Profil',
      add: 'Dodaj wpis',
      profileEdit: 'Edytuj profil',
      logout: 'Wyloguj',
      mainPolicy: 'Regulamin odznaki',
      privacyPolicy: 'Polityka prywatności',
      dashboard: 'Panel',
    },
  },
  terms: {
    privacy: 'Polityka Prywatności',
    main: 'Regulamin odznaki',
  },
  admin: {
    closePanel: 'Zamknij panel',
    menu: {
      home: 'Panel',
      posts: 'Wpisy',
      users: 'Użytkownicy',
      team: 'Zespół',
    },
    dashboard: {
      title: 'Panel główny',
      noUsers: 'brak',
      registered: 'zarejestrowanych Uźytkowników,',
      includes: 'w tym',
      lastDays: 'w ostatnich 7 dniach.',
      latestUser: 'Najnowszy Użytkownik:',
      posts: 'postów,',
      latestPost: 'Najnowszy wpis:',
      addedBy: 'dodany przez',
      hidden: 'wpisów ukrytych.',
      suspended: 'zawieszonych Użytkowników,',
      banned: 'zablokowanych Użytkowników,',
      team: 'Administracja',
      admin: 'Administratorów oraz',
      mod: 'Moderatorów',
      button: {
        showAll: 'Zobacz wszystko',
      },
    },
    post: {
      list: {
        filters: {
          latest: 'Ostatnie posty',
          hidden: 'Ukryte posty',
          fromSuspended: 'Wpisy zawieszonych użytkowników',
          fromBanned: 'Wpisy zablokowanych użytkowników',
        },
        legend: {
          title: 'Legenda:',
          admin: 'Administator',
          mod: 'Moderator',
          banned: 'Zablokowany',
        },
        empty: 'Brak wpisów...',
        back: 'Wróc',
      },
      alert: {
        hide: 'Czy chcesz ukryć wpis?',
        removeSuspend: 'Czy chcesz zakończyć zawieszenie Użykownika',
        removeBan: 'Czy checsz odblokować Użytkownika',
        suspend: 'Czy chcesz zawiesić Użytkownika',
        suspendTime: 'na jeden dzień?',
        ban: 'Czy chcesz zablokować Użytkownika',
      },
      addedBy: 'dodany przez',
      show: 'Pokaż post',
      hide: 'Ukryj wpis',
      addSuspension: 'Zawieś Użytkownika',
      removeSuspension: 'Zdejmij zawieszenie',
      addBan: 'Ban',
      removeBan: 'Zdejmij bana',
      back: 'Wróc',
    },
    user: {
      list: {
        title: 'Użytkownicy',
        empty: 'Brak użytkowników...',
        filters: {
          team: 'Zespół',
          latest: 'Najnowsi Użytkownicy',
          suspended: 'Zawieszeni',
          banned: 'Zablokowani',
        },
      },
      dropdown: {
        day: 'Doba',
        week: 'Tydzień',
        month: 'Miesiąc',
      },
      alert: {
        errorSuspend: 'Wybierz czas zawieszenia Użytkownika!',
        activateUser: 'Czy chcesz aktywować konto Użykownika',
        inactivateUser: 'Czy chcesz dezaktywować konto Użykownika',
        removeSuspend: 'Czy chcesz zakończyć zawieszenie Użykownika',
        removeBan: 'Czy checsz odblokować Użytkownika',
        suspend: 'Czy chcesz zawiesić Użytkownika',
        ban: 'Czy chcesz zablokować Użytkownika',
        alreadyBlocked: 'Użytkownik zablokowany',
        roleUpdateError: 'Nie można zmienić roli zablokowanego Użytkownika',
        accessDenied: 'nie masz dostępu do tej części aplikacji!',
        confirm: 'OK',
        cancel: 'Anuluj',
        suspendOn: 'na',
        suspendDaySingular: 'dzień',
        suspendDayPlural: 'dni',
      },
      message: {
        suspended: 'Zawieszenie konta',
        removeSuspended: 'Zawieszenie anulowane',
        banned: 'Zablokowano konto',
        removeBan: 'Odblokowano konto',
        promotion: 'Awans',
        degradation: 'Degradacja',
        messageHeader: 'Twoje konto zostało',
        messageHeaderBy: 'przez',
        messageConfirmationHeader: 'Konto Użytkownika',
        messageConfirmationHeaderAction: 'zostało',
        suspendedAction: 'zawieszone',
        removeSuspendedAction: 'odwieszone',
        suspendedMessageTimeout: 'Blokada zakończy się',
        bannedAction: 'zablokowane',
        removeBanAction: 'obdlokowane',
        roleMessageHeader: 'Twoja rola została zmieniona na',
        roleConfirmationMessageHeader: 'Rola Użytkownika',
        roleConfirmationMessageHeaderChanged: 'została zmeniona na',
      },
      banned: 'Konto zablokowane',
      registered: 'Zarejestrowany:',
      suspend: 'Konto zawieszone do',
      active: {
        title: 'Użytkownik',
        active: `aktywny`,
        inactive: 'nieaktywny',
      },
      totalSuspended: 'Łącznie ostrzeżeń (zawieszeń):',
      activate: 'Aktywuj',
      inactivate: 'Dezaktywuj',
      roleSave: 'Zapisz nową rolę',
      addSuspension: 'Zawieś Użytkownika',
      removeSuspension: 'Zdejmij zawieszenie',
      addBan: 'Ban',
      removeBan: 'Zdejmij bana',
      suspensionTime: 'Czas zawieszenia',
      back: 'Wróc',
    },
    team: {
      title: 'Zespół',
      filters: {
        admin: 'Administratorzy',
        mod: 'Moderatorzy',
      },
      admin: 'Administratorzy',
      mod: 'Moderatorzy',
    },
  },
};
