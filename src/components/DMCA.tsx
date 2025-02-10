import { motion } from "framer-motion";

const DMCA = () => {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl"
      >
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-red-400 to-pink-600 bg-clip-text text-transparent">
          Digital Millennium Copyright Act (DMCA) Policy
        </h1>

        <div className="space-y-6 text-gray-300">
          <p>
            HAVEN: Human Activity Valuation and Exploration Network is committed
            to protecting the rights of copyright owners while fostering a
            decentralized, ethically governed ecosystem for artificial
            intelligence-generated content. This policy outlines procedures for
            addressing copyright infringement and promoting responsible use of
            content on our platform.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Commitment to Copyright Protection
          </h2>
          <p>
            HAVEN adopts a Zero Tolerance Policy toward copyright infringement.
            Users are mandated to respect intellectual property rights under our
            Terms of Service and applicable law. They may not copy, adapt,
            distribute, or publicly display works of original authorship without
            authorization. Infringement accusations result in immediate action,
            including content removal and account termination, without refunds
            for remaining memberships.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Takedown Notice Requirements
          </h2>
          <p>
            Copyright owners must submit valid claims to HAVEN's Designated
            Agent (havennetwork@gmail.com) containing:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Signatory proof: A physical/electronic signature of the copyright
              owner or authorized representative.
            </li>
            <li>
              Work identification: Specific details of the infringed material
              (URLs, descriptions) and the infringing content's location.
            </li>
            <li>
              Contact details: Full name, address, phone, email, and physical
              mailing address.
            </li>
            <li>
              Statements: A declaration of good-faith belief in unauthorized use
              and accuracy under penalty of perjury.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Counter-Notification Process
          </h2>
          <p>
            Users affected by takedown notices can submit counterclaims via
            havennetwork@gmail.com, requiring:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Dispute report: Statement confirming content removal was due to
              HAVEN's procedures.
            </li>
            <li>
              Material details: Identification of removed content (URL,
              account-specific info).
            </li>
            <li>
              Legal assertions: Affirmation of good-faith belief in
              mistaken/misidentified claims and consent to jurisdiction.
            </li>
          </ul>
          <p>
            Valid counter-notices receive responses within 10–14 business days.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Repeat Infringer Policy
          </h2>
          <p>
            HAVEN employs a Three-Strike Rule: first offense triggers temporary
            access suspension; two-faults disable content sharing; failure to
            comply after three violations results in permanent account
            deactivation. Users must electronically certify removal of
            infringing material to reactivate privileges.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Enforcement and Compliance
          </h2>
          <p>
            HAVEN aligns operations with the Solana blockchain's cryptographic
            security and decentralized governance framework, ensuring
            transparent accountability for infringement cases. Users certifying
            ethical dataset generation via our reputation-based annotation
            system may leverage HAVEN's ZERO-KNOWLEDGE PROOF mechanisms to deter
            misuse.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Contact Information
          </h2>
          <p>
            Designated Agent:
            <br />
            HAVEN Support Team
            <br />
            <span className="text-white">havennetwork@gmail.com</span>
          </p>

          <p className="text-sm mt-8 text-gray-400">
            This policy complies with Title 17 U.S. Code § 512 and international
            equivalents. Updates occur monthly to reflect evolving legal
            standards, supported by HAVEN's automated protocol for regulatory
            compliance. Users are advised to review this policy quarterly via
            the DMCA section in our Terms of Service menu.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DMCA;
