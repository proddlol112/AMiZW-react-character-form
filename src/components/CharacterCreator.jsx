import { useState } from "react";
import CharacterForm from "./CharacterForm";
import CharacterPreview from "./CharacterPreview";
import SavePanel from "./SavePanel";

const initialForm = {
    name: "",
    race: "",
    classType: "",
    level: 1,
    weapon: "",
    description: "",
    isPremium: false,
    stats: {
        strength: 0,
        agility: 0,
        intelligence: 0,
    },
};

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

function CharacterCreator() {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [savedCharacter, setSavedCharacter] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const finalValue =
            type === "checkbox"
                ? checked
                : type === "number"
                ? Number(value)
                : value;

        if (name.startsWith("stats.")) {
            const statName = name.split(".")[1];

            setFormData((prev) => ({
                ...prev,
                stats: {
                    ...prev.stats,
                    [statName]: Number(value),
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: finalValue,
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (formData.name.trim().length < 3) {
            newErrors.name = "Nick musi mieć minimum 3 znaki";
        }

        if (!formData.race) {
            newErrors.race = "Rasa jest wymagana";
        }

        if (!formData.classType) {
            newErrors.classType = "Klasa jest wymagana";
        }

        if (formData.level < 1 || formData.level > 60) {
            newErrors.level = "Poziom musi być od 1 do 60";
        }

        if (!formData.weapon.trim()) {
            newErrors.weapon = "Broń jest wymagana";
        }

        if (formData.description.trim().length < 10) {
            newErrors.description = "Opis musi mieć minimum 10 znaków";
        }

        const statsSum =
            formData.stats.strength +
            formData.stats.agility +
            formData.stats.intelligence;

        if (statsSum > 15) {
            newErrors.stats =
                "Suma wszystkich statystyk nie może być większa niż 15";
        }

        return newErrors;
    };

    const handleSave = (e) => {
        e.preventDefault();

        const validationErrors = validate();

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setSavedCharacter(cloneData(formData));
        }
    };

    const handleLoadSaved = () => {
        if (savedCharacter) {
            setFormData(cloneData(savedCharacter));
        }
    };

    const handleDeleteSaved = () => {
        setSavedCharacter(null);
    };

    const handleResetForm = () => {
        setFormData(cloneData(initialForm));
        setErrors({});
    };

    return (
        <div className="creator-layout">
            <div className="panel">
                <h1>Kreator postaci RPG</h1>

                <CharacterForm
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    onSubmit={handleSave}
                />

                <SavePanel
                    hasSavedCharacter={!!savedCharacter}
                    onLoadSaved={handleLoadSaved}
                    onDeleteSaved={handleDeleteSaved}
                    onResetForm={handleResetForm}
                />
            </div>

            <div className="panel">
                <CharacterPreview
                    title="Podgląd aktualnego formularza"
                    character={formData}
                />

                <CharacterPreview
                    title="Zapisana postać"
                    character={savedCharacter}
                    emptyMessage="Brak zapisanej postaci."
                />
            </div>
        </div>
    );
}

export default CharacterCreator;