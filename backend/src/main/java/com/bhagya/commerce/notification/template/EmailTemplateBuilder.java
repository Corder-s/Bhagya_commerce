package com.bhagya.commerce.notification.template;

import java.math.BigDecimal;
import java.util.Map;

public final class EmailTemplateBuilder {

    private EmailTemplateBuilder() {}

    public static String buildOrderConfirmedHtml(String customerName, String orderNumber, BigDecimal totalAmount, String trackingUrl) {
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmed — Bhagya Commerce</title>
          <style>
            body { margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E1E1E; }
            .wrapper { max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border: 1px solid #EAE3D9; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
            .header { background: linear-gradient(135deg, #1E1E1E 0%, #2D261E 100%); padding: 36px 32px; text-align: center; border-bottom: 2px solid #D4AF37; }
            .brand { color: #D4AF37; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
            .tagline { color: #E8E2D9; font-size: 13px; margin-top: 6px; letter-spacing: 0.5px; }
            .content { padding: 36px 32px; line-height: 1.6; }
            .greeting { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1E1E1E; }
            .order-badge { display: inline-block; background-color: #F5EFEB; border: 1px solid #D4AF37; color: #1E1E1E; padding: 6px 14px; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 12px 0; }
            .summary-box { background-color: #FDFBF7; border: 1px solid #EAE3D9; border-radius: 8px; padding: 20px; margin: 24px 0; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px; }
            .summary-total { display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #EAE3D9; font-weight: 700; font-size: 17px; color: #1E1E1E; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #B89028 100%); color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 20px 0; text-align: center; box-shadow: 0 4px 12px rgba(212,175,55,0.3); }
            .footer { background-color: #F5EFEB; padding: 24px 32px; text-align: center; font-size: 12px; color: #6E685F; border-top: 1px solid #EAE3D9; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1 class="brand">BHAGYA COMMERCE</h1>
              <div class="tagline">Authentic Indian Artisan Heritage & GI Crafts</div>
            </div>
            <div class="content">
              <div class="greeting">Namaste %s,</div>
              <p>Your order has been confirmed and is being prepared with care by our verified master artisans.</p>
              <div class="order-badge">Order #%s</div>
              <div class="summary-box">
                <div class="summary-row"><span>Status</span><span style="color: #2E7D32; font-weight: 600;">Confirmed & Paid</span></div>
                <div class="summary-row"><span>Delivery</span><span>Delhivery Express (4-5 Days)</span></div>
                <div class="summary-total"><span>Total Paid</span><span>₹%s</span></div>
              </div>
              <div style="text-align: center;">
                <a href="%s" class="cta-button">Track Your Shipment</a>
              </div>
              <p style="font-size: 13px; color: #6E685F;">Every Bhagya purchase directly supports certified artisan guilds and preserves India's rich handloom traditions.</p>
            </div>
            <div class="footer">
              <p>© 2026 Bhagya Commerce Inc. All rights reserved.<br>Varanasi • Bengaluru • New Delhi</p>
            </div>
          </div>
        </body>
        </html>
        """.formatted(
            customerName != null ? customerName : "Valued Customer",
            orderNumber,
            totalAmount != null ? totalAmount.toPlainString() : "0.00",
            trackingUrl != null ? trackingUrl : "https://bhagya.commerce/account/orders"
        );
    }
}
