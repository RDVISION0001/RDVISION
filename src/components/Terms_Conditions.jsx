import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TermsConditions() {
    return (
        <div className="container mt-5 mb-5">
            <div className="card border-primary">
                {/* Fixed Header */}
                <div className="card-header bg-primary text-white text-center fixed-top">
                    <h1 className="display-4">Terms and Conditions</h1>
                </div>
                {/* Adding padding to avoid content being hidden behind fixed header */}
                <div className="card-body mt-5 pt-5">
                    <p className="lead">
                        Welcome to <strong>BuyMed24.com</strong>. Thank you for choosing us as your online pharmacy. These Terms and Conditions govern your use of our website and services. By accessing or using any part of our website or placing an order, you agree to be bound by these terms. Please read them carefully.
                    </p>

                    <h2 className="text-primary mt-4">1. Customs and Insurance Liability</h2>

                    <h3 className="mt-3 subheading">1.1. Customs Regulations and Responsibilities</h3>
                    <p>
                        BuyMed24.com shall not be held liable for any delays, seizures, or non-delivery of packages due to customs clearance in the destination country. It is the customer's responsibility to ascertain and comply with their country’s import regulations.
                    </p>

                    <h3 className="mt-3 subheading">1.2. Insurance Coverage</h3>
                    <p>
                        Customers are encouraged to purchase insurance for their shipments. Without insurance, any loss, damage, or seizure of packages after dispatch is the customer's responsibility.
                    </p>

                    <h3 className="mt-3 subheading">1.3. Customer Responsibility for Customs Issues</h3>
                    <p>
                        If your package is detained by customs, you must facilitate its release, including providing necessary documentation and paying applicable duties or taxes.
                    </p>

                    <h2 className="text-primary mt-4">2. Refund and Return Policy</h2>

                    <h3 className="mt-3 subheading">2.1. Eligibility for Refund</h3>
                    <p>
                        Refunds will only be issued upon our receipt of the returned package at our designated return facility in the United States. The package must be returned unopened, undamaged, and in its original condition to qualify for a refund.
                    </p>

                    <h3 className="mt-3 subheading">2.2. Return Process and Costs</h3>
                    <p>
                        Customers wishing to return a package must first contact BuyMed24.com customer service to obtain a Return Merchandise Authorization (RMA) number. The customer is responsible for all costs associated with returning the package, including shipping fees and any additional customs duties or taxes.
                    </p>

                    <h3 className="mt-3 subheading">2.3. Processing of Refunds</h3>
                    <p>
                        Refunds will be processed within 14 business days upon receipt and verification of the returned package. Please note that original shipping charges are non-refundable.
                    </p>

                    <h2 className="text-primary mt-4">3. Shipping Policy</h2>

                    <h3 className="mt-3 subheading">3.1. International Shipping Destinations</h3>
                    <p>
                        BuyMed24.com currently ships to the United States, the United Kingdom, and Australia. All shipments originate from our facilities in India.
                    </p>

                    <h3 className="mt-3 subheading">3.2. Shipping Times and Delays</h3>
                    <p>
                        Estimated shipping times may vary based on the destination and the efficiency of the destination country’s postal and customs services. BuyMed24.com is not responsible for delays caused by unforeseen events.
                    </p>

                    <h3 className="mt-3 subheading">3.3. Tracking Information</h3>
                    <p>
                        Upon dispatch, customers will receive a tracking number via email. It is the customer’s responsibility to monitor the status of their shipment.
                    </p>

                    <h2 className="text-primary mt-4">4. Compliance with Local Laws</h2>

                    <h3 className="mt-3 subheading">4.1. Legal Compliance</h3>
                    <p>
                        It is the customer's responsibility to ensure that the products ordered comply with the laws of their country. BuyMed24.com will not be held liable for any legal issues resulting from the importation of goods.
                    </p>

                    <h3 className="mt-3 subheading">4.2. Prohibited Products</h3>
                    <p>
                        Customers must ensure that the products they are ordering are not prohibited in their country. Any attempt to import restricted substances without proper authorization may lead to legal consequences.
                    </p>

                    <h2 className="text-primary mt-4">5. Limitation of Liability</h2>

                    <h3 className="mt-3 subheading">5.1. Exclusion of Warranties</h3>
                    <p>
                        BuyMed24.com provides its website and services on an “as is” basis. We make no warranties regarding the availability or reliability of the website or information contained therein.
                    </p>

                    <h3 className="mt-3 subheading">5.2. Limitation of Damages</h3>
                    <p>
                        Under no circumstances shall BuyMed24.com be liable for any direct or indirect damages resulting from the use of our website or services.
                    </p>

                    <h3 className="mt-3 subheading">5.3. Maximum Liability</h3>
                    <p>
                        In no event shall the total liability of BuyMed24.com exceed the amount paid by the customer for the specific product that gave rise to the claim.
                    </p>

                    <h2 className="text-primary mt-4">6. Modifications and Amendments</h2>

                    <h3 className="mt-3 subheading">6.1. Right to Modify Terms</h3>
                    <p>
                        BuyMed24.com reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on the website.
                    </p>

                    <h3 className="mt-3 subheading">6.2. Continued Use of Services</h3>
                    <p>
                        Your continued use of the website following any changes constitutes your acceptance of those changes. If you do not agree, you must discontinue your use of our services.
                    </p>

                    <h2 className="text-primary mt-4">7. Governing Law and Jurisdiction</h2>

                    <h3 className="mt-3 subheading">7.1. Governing Law</h3>
                    <p>
                        This Agreement shall be governed by the laws of the United States.
                    </p>

                    <h3 className="mt-3 subheading">7.2. Jurisdiction</h3>
                    <p>
                        Any disputes arising out of this Agreement shall be subject to the exclusive jurisdiction of the state and federal courts in the United States.
                    </p>

                    <p className="mt-4">
                        By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. For questions, please contact our customer service team.
                    </p>

                    <footer className="mt-5 text-center">
                        <strong>BuyMed24.com Team</strong>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default TermsConditions;
