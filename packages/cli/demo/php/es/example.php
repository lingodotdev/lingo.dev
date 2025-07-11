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
  '0' => 'Esta cadena posicional está localizada',
  '1' => 'Otra cadena posicional',
  '2' => 'Está "citado\\" y contiene una barra invertida \\ y un salto de línea\\nTodo esto está localizado',
  '3' => [
    'welcome_message' => 'Este mensaje de bienvenida está localizado'
  ],
  '4' => [
    'error_text' => 'Este texto de error está localizado'
  ],
  '5' => [
    'navigation' => [
      'home' => 'Esta etiqueta de inicio está localizada',
      'about' => 'Esta etiqueta de acerca de está localizada',
      'contact' => 'Esta etiqueta de contacto está localizada'
    ]
  ],
  '6' => [
    'forms' => [
      'login' => [
        'username_label' => 'Esta etiqueta de nombre de usuario está localizada',
        'password_label' => 'Esta etiqueta de contraseña está localizada',
        'submit_button' => 'Este texto del botón de envío está localizado'
      ]
    ]
  ],
  '7' => [
    'mixed_content' => [
      'title' => 'Este título está localizado',
      'count' => 42,
      'enabled' => true,
      'nothing_here' => null,
      'description' => 'Esta descripción está localizada'
    ]
  ]
];