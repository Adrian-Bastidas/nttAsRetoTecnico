package com.ntt.account_service.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.ntt.account_service.dtos.cliente.ClienteVo;
import com.ntt.account_service.dtos.cuenta.EstadoCuentaReporteVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class ReportePdfService {
    public byte[] generarReportePdf(List<EstadoCuentaReporteVO> reportes,
                                    ClienteVo cliente,
                                    Date desde,
                                    Date hasta) throws DocumentException {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, baos);
        document.open();

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
        Paragraph titulo = new Paragraph("REPORTE DE ESTADO DE CUENTA", titleFont);
        titulo.setAlignment(Element.ALIGN_CENTER);
        document.add(titulo);
        document.add(new Paragraph(" "));

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        Font infoFont = new Font(Font.FontFamily.HELVETICA, 10);

        document.add(new Paragraph("Cliente: " + cliente.getNombre(), infoFont));
        document.add(new Paragraph("Identificación: " + cliente.getIdentificacion(), infoFont));
        document.add(new Paragraph("Período: " + sdf.format(desde) + " - " + sdf.format(hasta), infoFont));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);

        String[] headers = {"Fecha", "Cliente", "Número Cuenta", "Tipo Cuenta",
                "Saldo Inicial", "Movimiento", "Saldo Disponible"};

        Font headerFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);

        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(BaseColor.DARK_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        Font dataFont = new Font(Font.FontFamily.HELVETICA, 9);
        SimpleDateFormat sdfFull = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

        for (EstadoCuentaReporteVO reporte : reportes) {
            table.addCell(new Phrase(sdfFull.format(reporte.getFecha()), dataFont));
            table.addCell(new Phrase(reporte.getCliente(), dataFont));
            table.addCell(new Phrase(reporte.getNumeroCuenta(), dataFont));
            table.addCell(new Phrase(reporte.getTipo(), dataFont));
            table.addCell(new Phrase(String.format("%.2f", reporte.getSaldoInicial()), dataFont));
            table.addCell(new Phrase(String.format("%.2f", reporte.getMovimiento()), dataFont));
            table.addCell(new Phrase(String.format("%.2f", reporte.getSaldoDisponible()), dataFont));
        }

        document.add(table);
        document.close();

        log.info("PDF generado exitosamente con {} registros", reportes.size());
        return baos.toByteArray();
    }
}
