const baseEmailTemplate = (content) => {
  return `
    <div style="margin:0;padding:40px 20px;background:#f4f6f8;font-family:Arial,sans-serif;">
      <div style="max-width:500px;margin:auto;background:#ffffff;border-radius:12px;padding:35px 30px;text-align:center;box-shadow:0 4px 15px rgba(0,0,0,0.08);">

        <h1 style="margin:0 0 8px;color:#2563eb;font-size:28px;">
          SnapBazaar
        </h1>

        <p style="margin:0 0 30px;color:#777;font-size:14px;">
          Your shopping destination
        </p>

        ${content}

        <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;">
          <p style="margin:0;color:#999;font-size:12px;">
            © SnapBazaar
          </p>
        </div>

      </div>
    </div>
  `;
};

// Signup OTP
export const signupOtpEmailTemplate = (otp) => {
  return baseEmailTemplate(`
    <h2 style="margin:0 0 12px;color:#222;font-size:22px;">
      Verify your email
    </h2>

    <p style="margin:0 0 25px;color:#555;font-size:15px;line-height:1.6;">
      Use the verification code below to complete your SnapBazaar signup.
    </p>

    <div style="display:inline-block;background:#f1f5ff;border:1px solid #dbe5ff;border-radius:10px;padding:16px 30px;margin-bottom:25px;">
      <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#2563eb;">
        ${otp}
      </span>
    </div>

    <p style="margin:0 0 8px;color:#555;font-size:14px;">
      This OTP will expire in <strong>5 minutes</strong>.
    </p>

    <p style="margin:25px 0 0;color:#888;font-size:13px;line-height:1.5;">
      If you didn't request this code, you can safely ignore this email.
    </p>
  `);
};

// Reset password OTP
export const resetOtpEmailTemplate = (otp) => {
  return baseEmailTemplate(`
    <h2 style="margin:0 0 12px;color:#222;font-size:22px;">
      Reset your password
    </h2>

    <p style="margin:0 0 25px;color:#555;font-size:15px;line-height:1.6;">
      Use the verification code below to continue resetting your SnapBazaar password.
    </p>

    <div style="display:inline-block;background:#f1f5ff;border:1px solid #dbe5ff;border-radius:10px;padding:16px 30px;margin-bottom:25px;">
      <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#2563eb;">
        ${otp}
      </span>
    </div>

    <p style="margin:0 0 8px;color:#555;font-size:14px;">
      This OTP will expire in <strong>5 minutes</strong>.
    </p>

    <p style="margin:25px 0 0;color:#888;font-size:13px;line-height:1.5;">
      If you didn't request this code, you can safely ignore this email.
    </p>
  `);
};

// Welcome email
export const welcomeEmailTemplate = (name) => {
  return baseEmailTemplate(`
    <h2 style="margin:0 0 15px;color:#222;font-size:22px;">
      Welcome, ${name}! 🎉
    </h2>

    <p style="margin:0;color:#555;font-size:15px;line-height:1.6;">
      Your SnapBazaar account has been created successfully.
      We're happy to have you with us!
    </p>
  `);
};

// Order email

export const orderEmailTemplate = ({ order, user }) => {
  return `
    <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:30px;">
      <div style="max-width:650px; margin:auto; background:#ffffff; border-radius:12px; padding:30px;">

        <h2 style="margin:0 0 8px; color:#111827;">
          Order Confirmed 🎉
        </h2>

        <p style="color:#64748b; margin-bottom:25px;">
          Hi ${user?.name || "Customer"}, your order has been placed successfully.
        </p>

        <div style="background:#eff6ff; padding:18px; border-radius:10px; margin-bottom:20px;">
          <p style="margin:5px 0;">
            <strong>Order ID:</strong> ${order._id}
          </p>

          <p style="margin:5px 0;">
            <strong>Total:</strong> ₹${order.totalAmount}
          </p>

          <p style="margin:5px 0;">
            <strong>Payment Method:</strong> ${order.paymentMethod}
          </p>

          <p style="margin:5px 0;">
            <strong>Payment Status:</strong> ${order.paymentStatus}
          </p>

          <p style="margin:5px 0;">
            <strong>Order Status:</strong> ${order.orderStatus}
          </p>
        </div>

        <h3 style="color:#111827; margin-bottom:12px;">
          Order Details
        </h3>

        ${order.items
          .map(
            (item) => `
              <div style="border-bottom:1px solid #e5e7eb; padding:15px 0;">
                <p style="margin:0 0 5px; font-weight:600; color:#111827;">
                  ${item.title}
                </p>

                <p style="margin:0; color:#64748b;">
                  Quantity: ${item.quantity}
                </p>

                <p style="margin:5px 0 0; color:#111827;">
                  Price: ₹${item.price}
                </p>
              </div>
            `,
          )
          .join("")}

        <div style="margin-top:20px; padding-top:15px; border-top:1px solid #e5e7eb;">

          <p style="margin:6px 0; color:#475569;">
            Subtotal: ₹${order.subtotal}
          </p>

          <p style="margin:6px 0; color:#475569;">
            Delivery: ₹${order.deliveryCharge}
          </p>

          <p style="margin:10px 0 0; font-size:18px; font-weight:700; color:#111827;">
            Total: ₹${order.totalAmount}
          </p>

        </div>

        <h3 style="color:#111827; margin-top:25px;">
          Shipping Address
        </h3>

        <p style="color:#64748b; line-height:1.6;">
          ${order.shippingAddress?.name || ""}<br/>
          ${order.shippingAddress?.address || ""}<br/>
          ${order.shippingAddress?.city || ""}<br/>
          ${order.shippingAddress?.state || ""} - ${
            order.shippingAddress?.pincode || ""
          }<br/>
          ${order.shippingAddress?.phone || ""}
        </p>

        <div style="margin-top:30px; padding-top:20px; border-top:1px solid #e5e7eb;">
          <p style="margin:0; color:#64748b; font-size:13px;">
            Thank you for shopping with SnapBazaar.
          </p>
        </div>

      </div>
    </div>
  `;
};
