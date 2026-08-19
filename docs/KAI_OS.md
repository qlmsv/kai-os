# K + AI OS

Корпоративная CRM и операционная система для бизнеса на русском языке.
Форк [Twenty](https://github.com/twentyhq/twenty) (релиз `v2.30.0`), развёрнутый
на Render по адресу **https://os.kai-it.pro**.

---

## 1. Инфраструктура

| Компонент | Render ID | План | Регион |
|---|---|---|---|
| Веб-сервис | `srv-da3054abkg8c73d7hibg` | Standard (2 ГБ) | Frankfurt |
| Фоновый воркер | `srv-da305ejl550s738c1rng` | Standard (2 ГБ) | Frankfurt |
| PostgreSQL 16 | `dpg-da2vvmrsmd2c738duco0-a` | Basic 1 ГБ | Frankfurt |
| Key Value (Redis) | `red-da2vvr0jo6nc73ahnhd0` | Starter | Frankfurt |
| Диск вложений | `dsk-da3054ibkg8c73d7hj0g` | 10 ГБ | — |

Регион Frankfurt выбран сознательно: для Казахстана и России сетевой маршрут
до Франкфурта существенно короче, чем до Сингапура.

Оба сервиса собираются из одного `packages/twenty-docker/twenty/Dockerfile`.
Веб-сервис запускает миграции БД и регистрирует cron-задачи, воркер — нет
(`DISABLE_DB_MIGRATIONS=true`, `DISABLE_CRON_JOBS_REGISTRATION=true`).

### Переменные окружения

| Переменная | Назначение |
|---|---|
| `SERVER_URL` | `https://os.kai-it.pro`. **Должен точно совпадать** с публичным адресом, иначе сервер отдаёт непрозрачные 403. |
| `PG_DATABASE_URL` | Внутренняя строка подключения к Postgres |
| `REDIS_URL` | Внутренняя строка подключения к Key Value |
| `ENCRYPTION_KEY` | Ключ шифрования данных. Потеря ключа = потеря доступа к зашифрованным полям. |
| `NODE_PORT` | `3000` |
| `STORAGE_TYPE` | `local` — файлы на диске веб-сервиса |

---

## 2. Что изменено относительно апстрима

Правки намеренно держатся на уровне текстов и ресурсов — имена пакетов и
переменных не трогались, чтобы сохранить возможность подтягивать обновления
Twenty через `git merge upstream/main`.

### Бренд

- `packages/twenty-front/index.html` — заголовок, описание, og/twitter-метатеги, `lang="ru"`
- `packages/twenty-front/public/manifest.json` — имя PWA
- `packages/twenty-front/public/images/integrations/twenty-logo.svg` — логотип
- `packages/twenty-front/public/images/icons/**` — 112 иконок перерисованы из логотипа
- `src/utils/title-utils.ts`, `DefaultWorkspaceName.ts`, `DefaultWorkspaceLogo.ts`
- Карточка MCP-сервера, системные промпты ИИ-агентов, настройки MCP
- `packages/twenty-emails/**` — логотип, подвал, заголовок и тексты писем

### Локализация

- Язык по умолчанию для нового участника — `ru-RU`
  (`compute-workspace-member-standard-flat-field-metadata.util.ts`)
- `packages/twenty-front/src/locales/ru-RU.po` — переведены все 274 остававшиеся
  строки, непереведённых не осталось
- Упоминания Twenty убраны из русских переводов интерфейса и писем

### Сборка

- **Стадия `twenty` сделана последней в Dockerfile.** Render собирает
  Dockerfile без `--target` и всегда берёт последнюю стадию, а в апстриме
  последняя — `twenty-app-dev` (образ «всё-в-одном» с Postgres и Redis внутри),
  для продакшена непригодная.
- **Тяжёлые стадии сериализованы.** Билд-контейнер Render ограничен 8 ГиБ.
  BuildKit по умолчанию выполнял `front-deps` и `server-deps` параллельно, и два
  резолвера yarn вместе выбивали OOM на 60-й секунде. Искусственные зависимости
  между стадиями выстраивают их в цепочку:
  `front-deps → server-deps → twenty-server-build → twenty-front-build`.
- **Heap сборки фронтенда снижен с 8192 до 6144 МБ** — при лимите 8 ГиБ прежнее
  значение не оставляло места под сам процесс сборки.

---

## 3. Готовые приложения

Twenty расширяется приложениями на `twenty-sdk`. Каркас нового приложения:

```bash
npx create-twenty-app@latest my-kai-app
```

### Встроены в монорепозиторий

`packages/twenty-apps/public/` — Slack, Discord, Linear, Exa, Fireflies,
Call Recorder, People Data Labs, Last Contact.
`packages/twenty-apps/examples/` — Document Generator, Hello World, Media Notes,
Postcard.

### Опубликованы в npm (24 пакета, ключевое слово `twenty-app`)

Наиболее применимые для российского и казахстанского рынка:

| Пакет | Что делает |
|---|---|
| `@pixelinfinito/twenty-app-whatsapp` | WhatsApp: общий инбокс, шаблоны, кампании с учётом согласий |
| `twenty-app-intake` | Приём заявок с любых веб-форм в CRM |
| `lead-scoring-agent` | ИИ-скоринг и обогащение лидов |
| `@numaya/greenlight` | Фильтр качества лидов со скорингом |
| `@twentyhq/call-recorder` | Запись и расшифровка звонков |
| `@twentyhq/last-contact` | Давность последнего касания по каждому контакту |
| `twenty-bells` | Лента активности рабочего пространства |
| `button-fields-app` | Настраиваемые поля-кнопки |
| `@excelium-tech/contract-approval` | ИИ-проверка договоров и согласование по ролям |
| `@excelium-tech/opportunity-economics` | Себестоимость, маржа и тип сделки |

Полный список: `https://registry.npmjs.org/-/v1/search?text=keywords:twenty-app`

---

## 4. Юридические ограничения

Ядро Twenty распространяется по **AGPLv3**, SDK и UI-библиотека — по MIT.

1. **AGPLv3 §13.** Пользователи сервиса по сети вправе получить исходный код.
   Требование закрыто ссылкой на репозиторий в подвале писем; репозиторий
   `github.com/qlmsv/kai-os` остаётся публичным.
2. **Копирайт удалять нельзя.** Убирать бренд Twenty из интерфейса законно —
   их товарный знак нам не лицензирован, — но файл `LICENSE` и авторские
   заголовки в исходниках должны остаться на месте.
3. **Файлы с пометкой `/* @license Enterprise */`** не покрыты AGPLv3 и
   требуют коммерческой подписки Twenty для использования в продакшене.
4. **Текст DPA** (`dpa-template.constant.ts`) намеренно не перебрендирован: это
   юридический документ, где стороной выступает Twenty.com PBC. Переписывать его
   на своё юрлицо нельзя — раздел следует либо отключить, либо заменить
   собственным соглашением.

Сознательно оставлены как функциональные значения: имя npm-пакета
`create-twenty-app`, команда `yarn twenty dev`, ключевое слово реестра
`twenty-app` и ссылки на документацию разработчика `docs.twenty.com`.

---

## 5. Эксплуатация

### Обновление с апстрима

```bash
git fetch upstream --tags
git merge upstream/main
```

Конфликты ожидаемы в `ru-RU.po` и в Dockerfile — правки сборки нужно сохранить.

### Известные ограничения

- **Хранилище не общее.** Диск Render монтируется только к одному сервису,
  поэтому вложения видит веб-сервис, но не воркер. Для продакшена нужно
  перейти на S3-совместимое хранилище (`STORAGE_TYPE=s3`), например Cloudflare R2.
- **Образ собирается дважды** — отдельно для веб-сервиса и для воркера. Сборка
  в GitHub Actions с публикацией в GHCR убрала бы дублирование и ускорила
  деплой с ~40 минут до ~2.
