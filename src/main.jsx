import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import confetti from "canvas-confetti";
import {
  Heart,
  CalendarDays,
  Utensils,
  Sparkles,
  MapPin,
  ArrowRight,
  Check,
  ChevronLeft
} from "lucide-react";
import { supabase } from "./supabase";
import "./styles.css";

const foods = [
  "Italian 🍝",
  "Indian 🍛",
  "Chinese 🥡",
  "Pizza 🍕",
  "Dessert date 🍰",
  "Surprise me 🎁"
];

const restaurants = [
  "Cozy & romantic 🕯️",
  "Rooftop 🌃",
  "Café ☕",
  "Fine dining ✨",
  "Casual & cute 🌸",
  "You choose 😌"
];

const areas = [
  "Near me 📍",
  "City centre 🌆",
  "Quiet & peaceful 🌿",
  "Anywhere with a view 🌅",
  "Surprise me 💫"
];

function App() {
  const [step, setStep] = useState(1);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const [inviteName, setInviteName] = useState("");
  const [loadingName, setLoadingName] = useState(true);

  const [answers, setAnswers] = useState({
    date: "",
    food: "",
    restaurant: "",
    area: ""
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const runAway = () => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const btnW = 120;
    const btnH = 48;

    const maxX = Math.max(0, rect.width - btnW - 32);
    const maxY = Math.max(0, rect.height - btnH - 120);

    const x = Math.round(Math.random() * maxX - maxX / 2);
    const y = Math.round(Math.random() * maxY - maxY / 2);

    setNoPos({ x, y });
  };

  const yes = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.65 }
    });

    setStep(3);
  };

  const choose = (key, value, nextStep = true) => {
    setAnswers((a) => ({
      ...a,
      [key]: value
    }));

    if (nextStep) {
      setTimeout(() => {
        setStep((s) => Math.min(s + 1, 6));
      }, 280);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    setAnswers((a) => ({
      ...a,
      date: selectedDate
    }));
  };

  const continueFromDate = () => {
    if (!answers.date) return;

    setStep(4);
  };

  const saveResponse = async () => {
    if (
      !answers.date ||
      !answers.food ||
      !answers.restaurant ||
      !answers.area
    ) {
      return;
    }

    setSaving(true);

    const payload = {
      invite_name: inviteName || "",
      date: answers.date,
      food: answers.food,
      restaurant: answers.restaurant,
      area: answers.area
    };

    const { error } = await supabase.from("date_responses").insert(payload);

    setSaving(false);

    if (error) {
      console.error(error);

      // friendly error UI
      alert("Oops! Something went wrong while saving our date. Please try again. 💗");

      return;
    }

    confetti({
      particleCount: 220,
      spread: 120,
      startVelocity: 35,
      origin: { y: 0.6 }
    });

    setSaved(true);
  };

  const progress = Math.max(0, Math.min(100, ((step - 1) / 5) * 100));

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  /*
   * Today's date.
   * This prevents selecting a date in the past.
   */
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    let mounted = true;

    const loadName = async () => {
      try {
        const { data, error } = await supabase
          .from("date_invite_config")
          .select("name")
          .eq("active", true)
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error loading invite name:", error);
        } else if (data && mounted) {
          setInviteName(data.name);
        } else if (mounted) {
          console.warn("No active invite name found in `date_invite_config`. Using friendly fallback.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoadingName(false);
      }
    };

    loadName();

    return () => (mounted = false);
  }, []);

  if (saved) {
    return (
      <main className="page">
        <div className="ambient a1" />
        <div className="ambient a2" />

        <section className="card success-card">
          <div className="success-heart">
            <Heart fill="currentColor" size={48} />
          </div>

          <span className="eyebrow">
            DATE LOCKED IN 💌
          </span>

          <h1>
            It's a date! 🥰
          </h1>

          <p className="subtitle">
            Your choices are safely with me.
            Now all that's left is to make it
            a beautiful day.
          </p>

          <div className="summary">

            <div>
              <span>📅</span>
              <b>{formatDate(answers.date)}</b>
            </div>

            <div>
              <span>🍽️</span>
              <b>{answers.food}</b>
            </div>

            <div>
              <span>🕯️</span>
              <b>{answers.restaurant}</b>
            </div>

            <div>
              <span>📍</span>
              <b>{answers.area}</b>
            </div>

          </div>

          <p className="tiny">
            Made with a ridiculous amount of love ❤️
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">

      <div className="ambient a1" />
      <div className="ambient a2" />
      <div className="ambient a3" />

      <section className="card" ref={cardRef}>

        <div className="topline">

          <div className="brand">
            <Heart
              size={17}
              fill="currentColor"
            />

            for my favourite person
          </div>

          <div className="step-count">
            {step}/6
          </div>

        </div>

        <div className="progress">
          <span
            style={{
              width: `${progress}%`
            }}
          />
        </div>

        {step > 1 && (
          <button
            className="back"
            onClick={() =>
              setStep(step - 1)
            }
          >
            <ChevronLeft size={17} />
            Back
          </button>
        )}
        {/* STEP 1 - WELCOME */}

        {step === 1 && (
          <div className="welcome-hero">

            <div className="hero-icon">
              <Heart fill="currentColor" size={38} />
            </div>

            {loadingName ? (
              <>
                <div className="welcome-line">Preparing something special… 💕</div>
              </>
            ) : (
              <>
                <h1 className="welcome-line">Hey, {inviteName || 'you'} 💕</h1>

                <p className="subtitle">You’re probably wondering why you’re here…</p>

                <p className="subtitle">I have one very important question for you.</p>

                <p className="subtitle">No pressure… okay, maybe just a tiny bit. 😌✨</p>

                <div className="button-row">
                  <button
                    className="primary"
                    onClick={() => setStep(2)}
                  >
                    OPEN MY LITTLE QUESTION 💌
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
              </>
            )}

          </div>
        )}

        {/* STEP 2 - BIG QUESTION */}

        {step === 2 && (
          <div className="hero">

            <div className="hero-icon">
              <Heart
                fill="currentColor"
                size={38}
              />
            </div>

            <span className="eyebrow">
              IMPORTANT QUESTION
            </span>

            <h1>
              Will you come
              <br />
              <em>on a date</em> with me?
            </h1>

            <p className="subtitle">
              I have a tiny plan… but I need
              your help making it perfect. 💗
            </p>

            <div className="button-row">

              <button
                className="primary"
                onClick={yes}
              >
                YES, OBVIOUSLY ❤️
                <Heart
                  size={18}
                  fill="currentColor"
                />
              </button>

              <button
                className="no-button"
                onMouseEnter={runAway}
                onTouchStart={runAway}
                style={{
                  transform: `translate(${noPos.x}px, ${noPos.y}px)`
                }}
              >
                No 🙈
              </button>

            </div>

            <p className="hint">
              P.S. The “No” button seems a
              little shy…
            </p>

          </div>
        )}

        {/* STEP 3 - DATE PICKER */}

        {step === 3 && (
          <ChoiceStep
            icon={<CalendarDays />}
            eyebrow="FIRST THINGS FIRST"
            title="When should we go?"
            subtitle="Pick the perfect day for our date. 💕"
          >

            <div className="date-picker-wrapper">

              <div className="date-picker-icon">
                <CalendarDays size={28} />
              </div>

              <label className="date-label">
                Choose your date
              </label>

              <input
                className="date-input-large"
                type="date"
                value={answers.date}
                min={today}
                onChange={handleDateChange}
              />

              {answers.date && (
                <div className="selected-date">
                  <span>💗</span>

                  <div>
                    <small>
                      OUR DATE
                    </small>

                    <strong>
                      {formatDate(
                        answers.date
                      )}
                    </strong>
                  </div>
                </div>
              )}

              <button
                className="primary date-continue"
                disabled={!answers.date}
                onClick={() => setStep(4)}
              >
                THIS DAY IT IS
                <ArrowRight size={18} />
              </button>

            </div>

          </ChoiceStep>
        )}

        {/* STEP 4 - FOOD */}

        {step === 4 && (
          <ChoiceStep
            icon={<Utensils />}
            eyebrow="THE IMPORTANT PART"
            title="What are you craving?"
            subtitle="Your tummy gets the final vote. 😋"
          >

            <div className="pill-grid">

              {foods.map((food) => (
                <Pill
                  key={food}
                  active={
                    answers.food === food
                  }
                  onClick={() =>
                    choose(
                      "food",
                      food
                    )
                  }
                >
                  {food}
                </Pill>
              ))}

            </div>

          </ChoiceStep>
        )}

        {/* STEP 5 - RESTAURANT STYLE */}

        {step === 5 && (
          <ChoiceStep
            icon={<Sparkles />}
            eyebrow="SET THE MOOD"
            title="What kind of restaurant?"
            subtitle="Let's find somewhere that feels like us."
          >

            <div className="pill-grid">

              {restaurants.map(
                (restaurant) => (
                  <Pill
                    key={restaurant}
                    active={
                      answers.restaurant ===
                      restaurant
                    }
                    onClick={() =>
                      choose(
                        "restaurant",
                        restaurant
                      )
                    }
                  >
                    {restaurant}
                  </Pill>
                )
              )}

            </div>

          </ChoiceStep>
        )}

        {/* STEP 6 - AREA */}

        {step === 6 && (
          <ChoiceStep
            icon={<MapPin />}
            eyebrow="ONE LAST THING"
            title="Where should we go?"
            subtitle="Choose the vibe — I'll handle the rest."
          >

            <div className="pill-grid">

              {areas.map((area) => (
                <Pill
                  key={area}
                  active={
                    answers.area === area
                  }
                  onClick={() =>
                    setAnswers((a) => ({
                      ...a,
                      area
                    }))
                  }
                >
                  {area}
                </Pill>
              ))}

            </div>

            <button
              className="primary final-btn"
              disabled={
                !answers.area ||
                saving
              }
              onClick={saveResponse}
            >
              {saving
                ? "SAVING OUR DATE…"
                : "LOCK IN OUR DATE"}

              <Check size={18} />
            </button>

          </ChoiceStep>
        )}

      </section>

      <footer>
        ♡ just two people, one lovely plan ♡
      </footer>

    </main>
  );
}

function ChoiceStep({
  icon,
  eyebrow,
  title,
  subtitle,
  children
}) {
  return (
    <div className="choice-step">

      <div className="small-icon">
        {icon}
      </div>

      <span className="eyebrow">
        {eyebrow}
      </span>

      <h2>
        {title}
      </h2>

      <p className="subtitle">
        {subtitle}
      </p>

      {children}

    </div>
  );
}

function Pill({
  children,
  onClick,
  active
}) {
  return (
    <button
      className={`pill ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      {children}

      <ArrowRight size={15} />
    </button>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);