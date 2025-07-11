<?php

/**
 * Test‑fixture illustrating what Lingo.dev’s PHP loader *will* and *won’t* localise.
 *
 * ⚠️  Important loader behaviours this file demonstrates:
 *   • Only **string values** are surfaced for translation – keys, numbers, booleans, and null are not.
 *   • Associative pairs that follow positional items are wrapped inside an extra numeric key
 *     after a round‑trip (see the generated Spanish file). This mix is intentional so the test
 *     captures that structural change.
 *   • All comments inside the returned array are stripped when the writer re‑serialises the file.
 */

return [
    // ───────────────────────────────────────────────
    // 1. Positional strings – localised
    // ───────────────────────────────────────────────
    'This positional string is localised',
    'Another positional string',

    // ───────────────────────────────────────────────
    // 2. Escaped characters – still localised
    // ───────────────────────────────────────────────
    "It's \"quoted\" and contains a back‑slash \\ and a line‑break\nAll of this is localised",

    // ───────────────────────────────────────────────
    // 3. Associative string values – localised (keys are NOT)
    // ───────────────────────────────────────────────
    'welcome_message' => 'This welcome message is localised',
    'error_text'      => 'This error text is localised',

    // ───────────────────────────────────────────────
    // 4. Nested arrays
    // ───────────────────────────────────────────────
    'navigation' => [
        'home'    => 'This home label is localised',
        'about'   => 'This about label is localised',
        'contact' => 'This contact label is localised',
    ],

    // ───────────────────────────────────────────────
    // 5. Deeply nested arrays
    // ───────────────────────────────────────────────
    'forms' => [
        'login' => [
            'username_label' => 'This username label is localised',
            'password_label' => 'This password label is localised',
            'submit_button'  => 'This submit button text is localised',
        ],
    ],

    // ───────────────────────────────────────────────
    // 6. Mixed data types – only strings are localised
    // ───────────────────────────────────────────────
    'mixed_content' => [
        'title'        => 'This title is localised',
        'count'        => 42,          // numbers survive untouched
        'enabled'      => true,        // booleans survive untouched
        'nothing_here' => null,        // null survives untouched
        'description'  => 'This description is localised',
    ],
];
