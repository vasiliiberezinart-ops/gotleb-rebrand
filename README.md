# GOTLEB — Rebrand Prototype

Концепт сайта для бренда обуви ручной работы [GOTLEB](https://gotleb.ru).
Заказчик: Андрей Жакевич.

**Эстетика:** Парижский архив (бумага + sepia + Cormorant Italic) × терминал-перебивки (JetBrains Mono ASCII между секциями).

## Запуск локально

```bash
cd gotleb-rebrand
python3 -m http.server 8000
open http://localhost:8000/
```

Без билд-степа, без npm. Чистая статика.

## Деплой

GitHub Pages, ветка `main`, корень репозитория.
URL: `https://vasiliiberezinart-ops.github.io/gotleb-rebrand/`

```bash
git push origin main
# Settings → Pages → Source: Deploy from branch → main / (root)
```

## Структура

```
.
├── index.html         главная
├── catalog.html       коллекция (9 пар)
├── product.html       карточка одной модели (Oxford 04)
├── about.html         история / материалы / шов / контакт
├── styles/
│   ├── tokens.css     CSS-переменные (палитра, шрифты, сетка)
│   └── main.css       компоненты, layout, состояния
├── js/main.js         меню, gallery, размер-pills, фильтры
├── assets/
│   ├── photos/        фото из gotleb.ru (Tilda CDN)
│   └── icons/         logo + grain.svg
└── docs/
    ├── specs/         design-doc
    └── plans/         implementation plan
```

## Что заменить (заглушки от Андрея)

Все заглушки помечены `[ ... ]` в HTML. Список полей — в `docs/specs/2026-05-10-gotleb-rebrand-design.md` §6 и §10:

- Hero-фраза главной (1 строка ≤8 слов)
- Манифест-блок (2-3 фразы ≤40 слов)
- Город мастерской, год основания, пар/мес
- Тип шва (goodyear / blake / hand-stitched)
- Описания материалов (Calf / Suede / Cordovan, по 2-3 строки)
- Описание шва (3-4 строки)
- Путь пары (1-2 фразы)
- Описания моделей в product-карточках

## Фото

Скачаны 9 файлов с tildacdn.com (4 PNG + 5 JPG). Продуктовый каталог Tilda рендерится JS, поэтому полный фотопул не доступен через curl. Для production-съёмки (с двойными ракурсами на каждую пару для hover-swap) — отдельная задача.

## Что НЕ работает (по дизайну)

Это концепт-прототип, не production e-commerce. Не реализовано:

- Корзина и оплата (UI присутствует, логики нет)
- Личный кабинет
- Реальный поиск
- Newsletter-отправка
- Динамический каталог (товары захардкожены в HTML)
- Hover-swap карточек (требует второго фото на пару)
- Многоязычность

Полный список — в `docs/specs/...` §7.

## Лицензия и шрифты

Прототип использует free Google Fonts (Cormorant Garamond, Inter, JetBrains Mono).
В production можно заменить на коммерческие близнецы: GT Sectra Italic, Söhne, в одном месте — `styles/tokens.css`.
