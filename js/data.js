const SERVICES = [
    {
        id: 's1',
        name: 'מניקור קלאסי',
        description: 'סידור ציפורניים, שיוף, הסרת עור ולק רגיל.',
        price: 80,
        durationMin: 45,
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600',
        category: 'manicure'
    },
    {
        id: 's2',
        name: 'מניקור ג\'ל',
        description: 'ציפוי ג\'ל איכותי עמיד לאורך זמן ומחזק את הציפורן.',
        price: 150,
        durationMin: 60,
        image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=600',
        category: 'manicure'
    },
    {
        id: 's3',
        name: 'פדיקור רפואי',
        description: 'טיפול יסודי בכפות הרגליים, הסרת עור קשה וטיפול בציפורניים.',
        price: 180,
        durationMin: 60,
<<<<<<< Updated upstream
        image: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&q=80&w=600',
=======
        image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=600',
>>>>>>> Stashed changes
        category: 'pedicure'
    },
    {
        id: 's4',
        name: 'בניית ציפורניים',
        description: 'הארכת הציפורניים באקריל או ג\'ל לעיצוב מושלם.',
        price: 250,
        durationMin: 90,
        image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=600',
        category: 'manicure'
    },
    {
        id: 's5',
        name: 'ספא הירגעות',
        description: 'עיסוי ידיים ורגליים מפנק עם שמנים אתריים.',
        price: 200,
        durationMin: 45,
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600',
        category: 'spa'
    }
];

const STAFF = [
    {
        id: 'st1',
        name: 'דנה כהן',
        specialties: ['s1', 's2', 's4'], // Manicure specialist
        availableHours: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00']
    },
    {
        id: 'st2',
        name: 'מיכל לוי',
        specialties: ['s3', 's5'], // Pedicure & Spa specialist
        availableHours: ['10:00', '11:30', '12:30', '14:30', '16:00']
    },
    {
        id: 'st3',
        name: 'נועה בר',
        specialties: ['s1', 's2', 's3', 's4', 's5'], // All rounder
        availableHours: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    }
];
