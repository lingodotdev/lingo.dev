import VTTIcon from "../../../public/vtt.svg";
import StorageIcon from "../../../public/storage.svg";
import WorkloadIcon from "../../../public/workload.svg";
import TimeIcon from "../../../public/time.svg";
import PluseIcon from "../../../public/pluse.svg";
import ArrowIcon from "../../../public/arrow-right.svg";
import styles from "./ImpactGrid.module.css";

export default function ImpactGrid() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Impact & Benefits for Global Companies</h2>
      <div className={styles.grid}>
        {/* VTT Card */}
        <div className={styles.card}>
          <div>
            <VTTIcon />
            <h3 className={styles.title}>
              Eliminates maintenance of transcripts and audio files
            </h3>
          </div>
          <p className={styles.description}>
            No need to manually create or store .vtt subtitle files and audio
            tracks for each language.
          </p>
        </div>

        {/* storage Card */}
        <div className={styles.card}>
          <div>
            <StorageIcon />
            <h3 className={styles.title}>Reduces database and storage costs</h3>
          </div>
          <p className={styles.description}>
            Subtitles are generated and translated on the fly, so companies
            don’t pay for storing multiple language files.
          </p>
        </div>

        {/* workload Card */}
        <div className={styles.card}>
          <div>
            <WorkloadIcon />
            <h3 className={styles.title}>Minimizes developer workload</h3>
          </div>
          <p className={styles.description}>
            No extra development effort is required to maintain multilingual
            video content.
          </p>
        </div>

        {/* time Card */}
        <div className={styles.card}>
          <div>
            <TimeIcon />
            <h3 className={styles.title}>Faster time-to-market</h3>
          </div>
          <p className={styles.description}>
            Videos can be shipped in days instead of months, accelerating global
            reach.
          </p>
        </div>

        {/* unlimited lang Card */}
        <div className={styles.card}>
          <div>
            <PluseIcon />
            <h3 className={styles.title}>Unlimited language support</h3>
          </div>
          <p className={styles.description}>
            AI-driven translation opens the door to reaching any country in the
            world.
          </p>
        </div>

        {/* bussiness focus card */}
        <div className={styles.card}>
          <div>
            <ArrowIcon />
            <h3 className={styles.title}>Focus on product, not translation</h3>
          </div>
          <p className={styles.description}>
            Teams can concentrate on improving the core product while the system
            handles multilingual content automatically.
          </p>
        </div>
      </div>
    </section>
  );
}
