package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.Enumeration;

/**
 * Servlet implementation class UserValidation
 */
public class UserValidation extends HttpServlet {
	{
		try {
			Class.forName("com.mysql.jdbc.Driver");  
		}
		catch(Exception e) {
			System.out.println(e);
			
		}
	}
	
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserValidation() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		PrintWriter out = response.getWriter();
		
		response.setContentType("text/html");
		if(isValidUser(email, password)) {
			out.println("Login Success...! from GET:)");
		}
		else {
			out.println("Sorry invalid credentials entered!");
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		String email = request.getParameter("userName");
		String password = request.getParameter("password");
		PrintWriter out = response.getWriter();
		
		response.setContentType("text/html");
		if(isValidUser(email, password)) {
			response.setStatus(200);
			out.println("Login Success...! from GET:)");
		}
		else {
			response.setStatus(401);
			out.println("Sorry invalid credentials entered!");
		}
	}

	private boolean isValidUser(String email, String password) {
		if(email == null  || password == null) {
			return false;
		}
		try {
			Connection con= DriverManager.getConnection("jdbc:mysql://localhost:3306/YouAndI_BillingApp","youandi_dev","developers_321");
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery("select * from user where email = '"+email+"';");
			if(!rs.next()) {
				return false;
			}
			String ps = rs.getString(4);
			return password.equals(ps);
		}
		catch(Exception e){
			System.out.println(e);
		}
		return false;
	}
}
