export type Locale = 'en-US' | 'de-DE' | 'es-MX' | 'ja-JP' | 'ar-SA';

export const locales: Record<string, string> = {
  'en-US': 'English (US)',
  'de-DE': 'Deutsch (German)',
  'es-MX': 'Español (Mexico)',
  'ja-JP': '日本語 (Japanese)',
  'ar-SA': 'العربية (Arabic)',
};

export const dictionary = {
  'en-US': {
    meta: {
        dir: 'ltr',
        font: 'font-sans'
    },
    hero: {
        title: "Global UX Playground",
        subtitle: "See how your components adapt to the world."
    },
    actions: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        confirm: "Confirm Changes"
    },
    formatting: {
        date: "Jan 23, 2026",
        price: "$1,299.00",
        label: "Launch Date & Cost"
    },
    components: {
        card: {
            title: "Project Alpha",
            description: "A secure, scalable platform for next-gen apps.",
            status: "Active"
        },
        modal: {
            title: "Delete Account?",
            body: "This action cannot be undone. All your data will be permanently removed from our servers.",
            cta: "Yes, delete my account"
        },
        notification: {
            success: "Changes saved successfully.",
            error: "An error occurred. Please try again."
        }
    },
    insights: {
        tone: "Neutral / Direct",
        length: "Short (1.0x)"
    }
  },
  'ar-SA': {
    meta: {
        dir: 'rtl',
        font: 'font-sans'
    },
    hero: {
        title: "ملعب تجربة المستخدم",
        subtitle: "شاهد كيف تتكيف مكوناتك مع العالم."
    },
    actions: {
        save: "حفظ",
        cancel: "إلغاء",
        delete: "حذف",
        confirm: "تأكيد التغييرات"
    },
    formatting: {
        date: "٢٣ يناير ٢٠٢٦",
        price: "١،٢٩٩٫٠٠ ر.س.‏",
        label: "تاريخ الاطلاق والتكلفة"
    },
    components: {
        card: {
            title: "مشروع ألفا",
            description: "منصة آمنة وقابلة للتطوير لتطبيقات الجيل القادم.",
            status: "نشط"
        },
        modal: {
            title: "حذف الحساب؟",
            body: "لا يمكن التراجع عن هذا الإجراء. سيتم إزالة جميع بياناتك بشكل دائم من خوادمنا.",
            cta: "نعم، احذف حسابي"
        },
        notification: {
            success: "تم حفظ التغييرات بنجاح.",
            error: "حدث خطأ. يرجى المحاولة مرة أخرى."
        }
    },
    insights: {
        tone: "Formal / Respectful",
        length: "Compact (0.9x) - RTL Flow"
    }
  },
  'de-DE': {
    meta: {
        dir: 'ltr',
        font: 'font-sans'
    },
    hero: {
        title: "Globaler UX-Spielplatz",
        subtitle: "Sehen Sie, wie sich Ihre Komponenten an die Welt anpassen."
    },
    actions: {
        save: "Specichern",
        cancel: "Abbrechen",
        delete: "Löschen",
        confirm: "Änderungen bestätigen"
    },
    formatting: {
        date: "23. Jan. 2026",
        price: "1.299,00 €",
        label: "Startdatum & Kosten"
    },
    components: {
        card: {
            title: "Projekt Alpha",
            description: "Eine sichere, skalierbare Plattform für Apps der nächsten Generation.",
            status: "Aktiv"
        },
        modal: {
            title: "Konto löschen?",
            body: "Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten werden dauerhaft von unseren Servern entfernt.",
            cta: "Ja, mein Konto löschen"
        },
        notification: {
            success: "Änderungen erfolgreich gespeichert.",
            error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
        }
    },
    insights: {
        tone: "Formal / Precise",
        length: "Long (1.4x) - Watch for overflow"
    }
  },
  'es-MX': {
    meta: {
        dir: 'ltr',
        font: 'font-sans'
    },
    hero: {
        title: "Patio de Recreo UX Global",
        subtitle: "Observa cómo tus componentes se adaptan al mundo entero."
    },
    actions: {
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
        confirm: "Confirmar Cambios"
    },
    formatting: {
        date: "23 de Ene, 2026",
        price: "$1,299.00",
        label: "Fecha y Costo"
    },
    components: {
        card: {
            title: "Proyecto Alfa",
            description: "Una plataforma segura y escalable diseñada para las aplicaciones de la próxima generación.",
            status: "Activo"
        },
        modal: {
            title: "¿Estás seguro de eliminar tu cuenta?", // More verbose
            body: "Esta acción es definitiva y no se puede deshacer. Todos tus datos serán eliminados permanentemente de nuestros servidores para siempre.", // More verbose
            cta: "Sí, eliminar mi cuenta ahora"
        },
        notification: {
            success: "Los cambios se han guardado con éxito.",
            error: "Ocurrió un error inesperado. Por favor inténtalo de nuevo."
        }
    },
    insights: {
        tone: "Warm / Verbose",
        length: "Medium-Long (1.3x)"
    }
  },
  'ja-JP': {
    meta: {
        dir: 'ltr',
        font: 'font-sans' // In a real app we might load a specific JP font
    },
    hero: {
        title: "グローバルUXプレイグラウンド",
        subtitle: "世界中のユーザーに合わせてコンポーネントがどう変化するか確認しましょう。"
    },
    actions: {
        save: "保存",
        cancel: "キャンセル",
        delete: "削除",
        confirm: "変更を確定"
    },
    formatting: {
        date: "2026年1月23日",
        price: "¥189,000",
        label: "開始日と費用"
    },
    components: {
        card: {
            title: "プロジェクト・アルファ",
            description: "次世代アプリのための、安全でスケーラブルなプラットフォーム。",
            status: "有効"
        },
        modal: {
            title: "アカウントを削除しますか？",
            body: "この操作は取り消せません。お客様のデータはサーバーから完全に削除されます。",
            cta: "削除する"
        },
        notification: {
            success: "保存しました。",
            error: "エラーが発生しました。"
        }
    },
    insights: {
        tone: "Polite / Contextual",
        length: "Compact (0.8x) - Dense info"
    }
  }
};
